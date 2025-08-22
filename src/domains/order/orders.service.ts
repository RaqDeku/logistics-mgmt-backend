import {
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
import { OrderStatusUpdatedEvent } from 'src/events/order-status-updated.event';
import {
  OrderActivity,
  OrderActivityDocument,
} from './schema/order.activities.schema';
import { OrderResponseDto } from './types';
import { Sender, SenderDocument } from './schema/sender.schema';

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
        const createdOrders: OrderDocument[] = [];
        for (const item of items_info) {
          const order = new this.orderModel({
            ...item,
            estimated_delivery_date: new Date(item.estimated_delivery_date),
            receiver: receiver.id,
            order_activities: [],
          });

          const savedOrder = await order.save({ session });

          const activity = new this.orderActivityModel({
            order_id: savedOrder.order_id,
            status: OrderStatus.PROCESSING,
            admin: admin.id,
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
          orderEvent.status = OrderStatus.PROCESSING;
          orderEvent.net_weight = order.net_weight;
          orderEvent.receiver_email = receiver.email;
          orderEvent.receiver_name = receiver.full_name;

          this.eventEmitter.emit('order.created', orderEvent);
        });
      });

      return 'Order created successfully';
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('Something went wrong');
    } finally {
      session.endSession();
    }
  }

  async getAllOrders(): Promise<OrderResponseDto[]> {
    try {
      const orders = await this.orderModel
        .find()
        .select('-createdAt -updatedAt -__v')
        .populate<{ receiver: ReceiverDocument }>({
          path: 'receiver',
          select: 'full_name',
        })
        .populate<{ order_activities: OrderActivityDocument[] }>({
          path: 'order_activities',
          select: 'status',
          options: {
            sort: { date: -1 },
          },
        })
        .exec();

      return orders.map((o) => ({
        _id: o.id,
        item_type: o.item_type,
        item_description: o.item_description,
        net_weight: o.net_weight,
        receiver: o.receiver?.full_name,
        estimated_delivery_date: o.estimated_delivery_date,
        status: o.order_activities[0]?.status,
        order_id: o.order_id,
      }));
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getOrderById(order_id: string) {
    const order = await this.orderModel
      .findOne({ order_id })
      .select('-createdAt -updatedAt -__v')
      .populate([
        {
          path: 'receiver',
          select: '-createdAt -updatedAt -orders -__v',
        },
        {
          path: 'order_activities',
          select: '-createdAt -updatedAt -__v -admin',
        },
      ])
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(
    order_id: string,
    updateOrderStatus: UpdateOrderStatus,
    admin: AdminPayload,
  ) {
    const order = await this.orderModel.findOne({ order_id }).exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        const activity = new this.orderActivityModel({
          status: updateOrderStatus.status,
          reason: updateOrderStatus.reason,
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

        const orderUpdatedEvent = new OrderStatusUpdatedEvent();
        orderUpdatedEvent.id = order.order_id;
        orderUpdatedEvent.type = order.item_type;
        orderUpdatedEvent.estimated_delivery_date =
          order.estimated_delivery_date.toDateString();
        orderUpdatedEvent.status = updateOrderStatus.status;
        orderUpdatedEvent.net_weight = order.net_weight;
        orderUpdatedEvent.receiver_email = receiver.email;
        orderUpdatedEvent.receiver_name = receiver.full_name;
        orderUpdatedEvent.reason = updateOrderStatus.reason;

        this.eventEmitter.emit('order.updated', orderUpdatedEvent);
      });

      return 'Order updated successfully';
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async trackOrder(order_id: string) {
    const order = await this.orderModel.findOne({ order_id }).exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    try {
      return await this.orderActivityModel
        .find({ order_id })
        .select('status date')
        .sort({ date: -1 })
        .exec();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
