import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { Receiver, ReceiverDocument } from './schema/reciever.schema';
import { CreateOrdersDto } from './dto/create-order.dto';
import { OrderCreatedEvent } from 'src/events/order-created.event';
import { UpdateOrderStatus } from './dto/update-status.dto';
import { OrderStatus, UpdateOrderStatuses } from './constants';
import { OrderOnHoldEvent } from 'src/events/order-on-hold.event';
import {
  OrderActivity,
  OrderActivityDocument,
} from './schema/order.activities.schema';
import {
  GetOrderByIdResponseDto,
  OrderResponseDto,
  TrackOrderResponseDto,
} from './types';
import { Sender, SenderDocument } from './schema/sender.schema';
import { AdminDocument } from '../auth/schema/admin.schema';
import { OrderInTransitEvent } from 'src/events/order-in-transit.event';
import { OrderDeliveredEvent } from 'src/events/order-delivered.event';

interface AdminPayload {
  id: string;
  email: string;
}
@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Receiver.name)
    private readonly receiverModel: Model<ReceiverDocument>,
    @InjectModel(OrderActivity.name)
    private readonly orderActivityModel: Model<OrderActivityDocument>,
    @InjectModel(Sender.name)
    private readonly senderModel: Model<SenderDocument>,
    @InjectConnection()
    private readonly connection: Connection,
    private eventEmitter: EventEmitter2,
  ) {}

  async createOrders(createOrderDto: CreateOrdersDto, admin: AdminPayload) {
    const { items_info, receiver_info, sender_info } = createOrderDto;
    const session = await this.connection.startSession();

    try {
      const createdOrders: OrderDocument[] = [];

      await session.withTransaction(async () => {
        // save receiver of order(s)
        const receiver = new this.receiverModel({
          ...receiver_info,
          orders: [],
        });
        await receiver.save({ session });

        // save senders of order(s)
        const sender = new this.senderModel({
          ...sender_info,
          orders: [],
        });
        await sender.save({ session });

        // save order(s) with receiver & sender id
        for (const item of items_info) {
          const order = new this.orderModel({
            ...item,
            estimated_delivery_date: new Date(item.estimated_delivery_date),
            receiver: receiver.id,
            sender: sender.id,
            order_activities: [],
          });

          const savedOrder = await order.save({ session });

          const activity = new this.orderActivityModel({
            order_id: savedOrder.order_id,
            status: OrderStatus.CREATED,
            admin: admin.id,
            location: 'OceanLink Logistics Warehouse',
            date: new Date(Date.now()),
          });

          const savedActivity = await activity.save({ session });

          savedOrder.order_activities = [savedActivity.id];
          await savedOrder.save({ session });

          createdOrders.push(savedOrder);
        }

        // update receiver & sender orders with saved orders
        receiver.orders = createdOrders.map((order) => order.id);
        sender.orders = createdOrders.map((order) => order.id);

        await sender.save({ session });
        await receiver.save({ session });

        createdOrders.forEach((order) => {
          const orderEvent = new OrderCreatedEvent();
          orderEvent.id = order.order_id;
          orderEvent.type = order.item_type;
          orderEvent.estimated_delivery_date =
            order.estimated_delivery_date.toDateString();
          orderEvent.status = OrderStatus.CREATED;
          orderEvent.net_weight = order.net_weight;
          orderEvent.receiver_email = receiver.email;
          orderEvent.receiver_name = receiver.full_name;

          this.eventEmitter.emit('order.created', orderEvent);
        });
      });

      return createdOrders.map((o) => ({ order_id: o.order_id }))[0];
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('Something went wrong');
    } finally {
      await session.endSession();
    }
  }

  async getAllOrders(): Promise<OrderResponseDto[]> {
    try {
      const orders = await this.orderModel
        .find()
        .sort({ createdAt: -1 })
        .select('-createdAt -updatedAt -__v')
        .populate<{ receiver: ReceiverDocument }>({
          path: 'receiver',
          select: 'full_name',
        })
        .populate<{ sender: SenderDocument }>({
          path: 'sender',
          select: 'full_name',
        })
        .populate<{ order_activities: OrderActivityDocument[] }>({
          path: 'order_activities',
          select: 'status reason duration notes estimated_delivery_date',
          options: {
            sort: { date: -1 },
          },
          perDocumentLimit: 1,
        })
        .exec();

      return orders.map((order) => {
        const latestActivity = order.order_activities?.[0];
        const isOnHold = latestActivity?.status === UpdateOrderStatuses.ON_HOLD;

        return {
          order_id: order.order_id,
          item_type: order.item_type,
          sender: order.sender?.full_name,
          receiver: order.receiver?.full_name,
          estimated_delivery_date:
            latestActivity?.estimated_delivery_date ??
            order.estimated_delivery_date,
          status: latestActivity?.status,
          is_on_hold: isOnHold,
          notes: latestActivity?.notes,
          hold_reason: isOnHold ? latestActivity.reason : undefined,
          hold_duration: isOnHold ? latestActivity.duration : undefined,
        };
      });
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getOrderById(order_id: string): Promise<GetOrderByIdResponseDto> {
    const order = await this.orderModel
      .findOne({ order_id })
      .select('-updatedAt -__v')
      .populate([
        {
          path: 'receiver',
          select: '-createdAt -updatedAt -orders -__v',
        },
        {
          path: 'sender',
          select: '-createdAt -updatedAt -orders -__v',
        },
      ])
      .populate<{ order_activities: OrderActivityDocument[] }>({
        path: 'order_activities',
        select: '-__v -updatedAt',
        options: { sort: { date: -1 }, limit: 1 },
        populate: {
          path: 'admin',
          select: 'full_name',
        },
      })
      .lean()
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const latestActivity = order.order_activities?.[0];
    const holdDetails = {
      ...latestActivity,
      placedBy: (latestActivity.admin as unknown as AdminDocument)?.full_name,
      admin: undefined,
    };
    const isOnHold = latestActivity?.status === UpdateOrderStatuses.ON_HOLD;

    return {
      order_id: order.order_id,
      item_type: order.item_type,
      item_description: order.item_description,
      net_weight: order.net_weight,
      receiver: order.receiver as any,
      sender: order.sender as any,
      estimated_delivery_date:
        latestActivity?.estimated_delivery_date ??
        order.estimated_delivery_date,
      revenue: order.revenue,
      estimated_value: order.estimated_value,
      order_status: latestActivity?.status ?? null,
      current_hold: isOnHold ? (holdDetails as any) : undefined,
    };
  }

  async updateOrderStatus(
    order_id: string,
    updateOrderStatus: UpdateOrderStatus,
    admin: AdminPayload,
  ) {
    const order = await this.orderModel
      .findOne({ order_id })
      .populate<{ order_activities: OrderActivityDocument[] }>({
        path: 'order_activities',
        select: 'status',
        options: { sort: { date: -1 }, limit: 1 },
      })
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const latestActivity = order.order_activities?.[0];

    if (latestActivity?.status === updateOrderStatus.status) {
      throw new BadRequestException('Order is already in this status');
    }

    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        const activity = new this.orderActivityModel({
          status: updateOrderStatus.status,
          reason: updateOrderStatus.reason,
          notes: updateOrderStatus.notes,
          duration: updateOrderStatus.duration,
          location: updateOrderStatus.location,
          estimated_delivery_date: updateOrderStatus.estimated_delivery_date
            ? new Date(updateOrderStatus?.estimated_delivery_date)
            : null,
          date: new Date(Date.now()),
          admin: admin.id,
          order_id: order.order_id,
        });

        await activity.save({ session });
        order.order_activities = [...order.order_activities, activity.id];

        await order.save({ session });

        const receiver = await this.receiverModel
          .findOne({ orders: { $in: [order.id] } })
          .exec();

        this.emitOrderEvent(updateOrderStatus.status, {
          order,
          receiver,
          activity,
        });
      });

      return 'Order updated successfully';
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('Something went wrong');
    } finally {
      await session.endSession();
    }
  }

  async trackOrder(order_id: string): Promise<TrackOrderResponseDto> {
    const order = await this.orderModel
      .findOne({ order_id })
      .select('order_id item_type estimated_delivery_date')
      .lean()
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const orderActivities = await this.orderActivityModel
      .find({ order_id })
      .select('status date reason notes duration location -_id')
      .sort({ date: -1 })
      .lean()
      .exec();

    return {
      ...order,
      status: orderActivities[0]?.status ?? null,
      timeline: orderActivities,
    };
  }

  async deleteOrder(order_id: string) {
    const order = await this.orderModel
      .findOne({ order_id })
      .populate<{ order_activities: OrderActivityDocument[] }>({
        path: 'order_activities',
        select: '-__v -updatedAt',
        options: { sort: { date: -1 }, limit: 1 },
      })
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const latestActivity = order.order_activities?.[0];
    if (
      [UpdateOrderStatuses.IN_TRANSIT, UpdateOrderStatuses.ON_HOLD].includes(
        latestActivity?.status as UpdateOrderStatuses,
      )
    ) {
      throw new BadRequestException(`Cannot delete order at the moment`);
    }

    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        await this.orderModel.deleteOne({ order_id }, { session }).exec();

        await this.orderActivityModel
          .deleteMany({ order_id }, { session })
          .exec();

        await this.receiverModel
          .deleteOne({ orders: { $in: order.id } }, { session })
          .exec();

        await this.senderModel
          .deleteOne({ orders: { $in: order.id } }, { session })
          .exec();
      });

      return 'Order deleted successfully';
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('Something went wrong');
    } finally {
      await session.endSession();
    }
  }

  private async emitOrderEvent(
    status: UpdateOrderStatuses,
    {
      order,
      receiver,
      activity,
    }: {
      order: OrderDocument | any;
      receiver: ReceiverDocument;
      activity: OrderActivityDocument;
    },
  ) {
    switch (status) {
      case UpdateOrderStatuses.ON_HOLD: {
        const orderOnHoldEvent = new OrderOnHoldEvent();

        orderOnHoldEvent.id = order.order_id;
        orderOnHoldEvent.receiver_email = receiver.email;
        orderOnHoldEvent.receiver_name = receiver.full_name;
        orderOnHoldEvent.duration = activity.duration;
        orderOnHoldEvent.notes = activity.notes;
        orderOnHoldEvent.reason = activity.reason;

        this.eventEmitter.emit('order.updated.on-hold', orderOnHoldEvent);
        break;
      }
      case UpdateOrderStatuses.IN_TRANSIT: {
        const orderInTransitEvent = new OrderInTransitEvent();

        orderInTransitEvent.id = order.order_id;
        orderInTransitEvent.receiver_email = receiver.email;
        orderInTransitEvent.receiver_name = receiver.full_name;
        orderInTransitEvent.estimated_delivery_date =
          activity.estimated_delivery_date.toDateString();
        orderInTransitEvent.notes = activity.notes;

        this.eventEmitter.emit('order.updated.in-transit', orderInTransitEvent);
        break;
      }
      case UpdateOrderStatuses.DELIVERED: {
        const orderDeliveredEvent = new OrderDeliveredEvent();

        orderDeliveredEvent.id = order.order_id;
        orderDeliveredEvent.receiver_email = receiver.email;
        orderDeliveredEvent.receiver_name = receiver.full_name;
        orderDeliveredEvent.delivery_date =
          activity.estimated_delivery_date.toDateString();

        this.eventEmitter.emit('order.updated.delivered', orderDeliveredEvent);
        break;
      }
    }
  }
}
