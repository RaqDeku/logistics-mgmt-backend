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
    @InjectConnection()
    private readonly connection: Connection,
    private eventEmitter: EventEmitter2,
  ) {}

  async createOrders(createOrderDto: CreateOrdersDto, admin: AdminPayload) {
    const { items_info, receiver_info } = createOrderDto;
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        // save owner of order(s) first
        const receiver = new this.receiverModel({
          ...receiver_info,
          orders: [],
        });
        await receiver.save({ session });

        // save order(s) with owner id
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

        // update owner orders with saved orders
        receiver.orders = createdOrders.map((order) => order.id);
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

  async analytics() {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);

    const [orderStats, recentActivities] = await Promise.all([
      this.orderModel
        .aggregate([
          {
            $lookup: {
              from: 'orderactivities',
              let: { orderId: '$order_id' },
              pipeline: [
                { $match: { $expr: { $eq: ['$order_id', '$$orderId'] } } },
                { $sort: { date: -1 } },
                { $project: { status: 1, date: 1, admin: 1 } },
              ],
              as: 'activities',
            },
          },
          {
            $addFields: {
              latestActivity: { $arrayElemAt: ['$activities', 0] },
            },
          },
          {
            $addFields: {
              currentStatus: '$latestActivity.status',
            },
          },
          {
            $addFields: {
              deliveryDate: {
                $cond: {
                  if: {
                    $eq: ['$currentStatus', UpdateOrderStatuses.DELIVERED],
                  },
                  then: '$latestActivity.date',
                  else: null,
                },
              },
            },
          },
          {
            $addFields: {
              deliveryTime: {
                $cond: {
                  if: { $ne: ['$deliveryDate', null] },
                  then: {
                    $divide: [
                      { $subtract: ['$deliveryDate', '$createdAt'] },
                      86400000,
                    ],
                  }, // Milliseconds to days
                  else: null,
                },
              },
            },
          },
          {
            $facet: {
              statusCounts: [
                { $group: { _id: '$currentStatus', count: { $sum: 1 } } },
                { $project: { _id: 0, status: '$_id', count: 1 } },
              ],
              total: [
                { $group: { _id: null, total: { $sum: 1 } } },
                { $project: { _id: 0, total: 1 } },
              ],
              avgDeliveryTime: [
                { $match: { deliveryTime: { $ne: null } } },
                { $group: { _id: null, avg: { $avg: '$deliveryTime' } } },
                {
                  $project: {
                    _id: 0,
                    avgDeliveryTime: { $round: ['$avg', 1] },
                  },
                },
              ],
              deliverySuccessRate: [
                {
                  $group: {
                    _id: null,
                    delivered: {
                      $sum: {
                        $cond: [
                          {
                            $eq: [
                              '$currentStatus',
                              UpdateOrderStatuses.DELIVERED,
                            ],
                          },
                          1,
                          0,
                        ],
                      },
                    },
                    total: { $sum: 1 },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    deliverySuccessRate: {
                      $round: [
                        {
                          $multiply: [
                            { $divide: ['$delivered', '$total'] },
                            100,
                          ],
                        },
                        1,
                      ],
                    },
                  },
                },
              ],
              revenueOverview: [
                { $match: { currentStatus: UpdateOrderStatuses.DELIVERED } },
                {
                  $group: {
                    _id: null,
                    totalRevenue: { $sum: '$revenue' }, // Assuming 'revenue' field in order model
                    deliveredCount: { $sum: 1 },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    totalRevenue: 1,
                    averagePerShipment: {
                      $round: [
                        {
                          $divide: [
                            '$totalRevenue',
                            { $ifNull: ['$deliveredCount', 1] },
                          ],
                        },
                        0,
                      ],
                    },
                  },
                },
              ],
              monthlyPerformance: [
                { $match: { deliveryDate: { $ne: null, $gte: startOfYear } } },
                {
                  $group: {
                    _id: {
                      $dateToString: { format: '%m', date: '$deliveryDate' },
                    },
                    shipments: { $sum: 1 },
                    revenue: { $sum: '$revenue' },
                  },
                },
                { $sort: { _id: 1 } },
                {
                  $project: { _id: 0, month: '$_id', shipments: 1, revenue: 1 },
                },
              ],
            },
          },
          {
            $project: {
              statusCounts: 1,
              total: { $arrayElemAt: ['$total.total', 0] },
              avgDeliveryTime: {
                $arrayElemAt: ['$avgDeliveryTime.avgDeliveryTime', 0],
              },
              deliverySuccessRate: {
                $arrayElemAt: ['$deliverySuccessRate.deliverySuccessRate', 0],
              },
              revenueOverview: { $arrayElemAt: ['$revenueOverview', 0] },
              monthlyPerformance: 1,
            },
          },
        ])
        .exec(),
      this.orderActivityModel
        .aggregate([
          { $sort: { date: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: 'orders',
              localField: 'order_id',
              foreignField: 'order_id',
              as: 'orderInfo',
            },
          },
          { $unwind: { path: '$orderInfo', preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: 'admins',
              let: { adminIdStr: '$admin' },
              pipeline: [
                {
                  // Convert "admin._id" to string and compare with "orderactivity.admin" value
                  $match: {
                    $expr: {
                      $eq: [
                        { $toString: '$_id' },
                        { $ifNull: [{ $toString: '$$adminIdStr' }, null] },
                      ],
                    },
                  },
                },
                { $project: { full_name: 1, _id: 1 } },
              ],
              as: 'adminInfo',
            },
          },
          { $unwind: { path: '$adminInfo', preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: 'receivers',
              let: { receiverId: '$orderInfo.receiver' },
              pipeline: [
                {
                  // Convert "receiver._id" to string and compare with "order.receiver" value
                  $match: {
                    $expr: {
                      $eq: [
                        { $toString: '$_id' },
                        { $toString: '$$receiverId' },
                      ],
                    },
                  },
                },
                { $project: { full_name: 1, _id: 1 } },
              ],
              as: 'orderInfo.receiverInfo',
            },
          },
          {
            $unwind: {
              path: '$orderInfo.receiverInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              'orderInfo.receiver.full_name':
                '$orderInfo.receiverInfo.full_name',
            },
          },
          {
            $project: {
              _id: 0,
              description: {
                $concat: [
                  'Package ',
                  {
                    $toString: { $ifNull: ['$orderInfo.order_id', 'Unknown'] },
                  },
                  ' ',
                  { $toLower: '$status' },
                  {
                    $cond: {
                      if: { $eq: ['$status', UpdateOrderStatuses.DELIVERED] },
                      then: {
                        $concat: [
                          ' to ',
                          {
                            $ifNull: [
                              '$orderInfo.receiver.full_name',
                              'Unknown Destination',
                            ],
                          },
                        ],
                      },
                      else: '',
                    },
                  },
                  {
                    $cond: {
                      if: { $eq: ['$status', UpdateOrderStatuses.ON_HOLD] },
                      then: { $concat: [' - ', { $toString: '$reason' }] },
                      else: '',
                    },
                  },
                  {
                    $cond: {
                      if: {
                        $and: [
                          { $eq: ['$status', UpdateOrderStatuses.IN_TRANSIT] },
                          { $ne: [{ $ifNull: ['$reason', ''] }, ''] },
                        ],
                      },
                      then: { $concat: [' - ', { $ifNull: ['$reason', ''] }] },
                      else: '',
                    },
                  },
                ],
              },
              by: { $ifNull: ['$adminInfo.full_name', 'Admin User'] },
              date: { $dateToString: { format: '%d %b', date: '$date' } },
            },
          },
        ])
        .exec(),
    ]);

    const stats = orderStats[0] || {};

    // Fill monthly performance with all months (Jan-Dec), setting missing to 0
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const fullMonthly = [];
    for (let i = 1; i <= 12; i++) {
      const monthStr = i.toString().padStart(2, '0');
      const found = (stats.monthlyPerformance || []).find(
        (m) => m.month === monthStr,
      );
      fullMonthly.push({
        month: monthNames[i - 1],
        shipments: found ? found.shipments : 0,
        revenue: found ? found.revenue : 0,
      });
    }

    // Prepare result
    const result = {
      totalShipments: stats.total || 0,
      inTransit: 0,
      onHold: 0,
      delivered: 0,
      processing: 0,
      avgDeliveryTime: stats.avgDeliveryTime || 0,
      deliverySuccessRate: stats.deliverySuccessRate || 0,
      revenueOverview: {
        totalRevenue: stats.revenueOverview?.totalRevenue || 0,
        averagePerShipment: stats.revenueOverview?.averagePerShipment || 0,
      },
      monthlyPerformance: fullMonthly,
      recentActivities: recentActivities || [],

      statusDistribution: {
        inTransit: { count: 0, percentage: 0 },
        onHold: { count: 0, percentage: 0 },
        delivered: { count: 0, percentage: 0 },
        processing: { count: 0, percentage: 0 },
      },
    };

    const total = result.totalShipments;
    (stats.statusCounts || []).forEach((item) => {
      if (item.status === UpdateOrderStatuses.IN_TRANSIT) {
        result.inTransit = item.count;
        result.statusDistribution.inTransit = {
          count: item.count,
          percentage:
            total > 0 ? Math.round((item.count / total) * 1000) / 10 : 0,
        };
      } else if (item.status === UpdateOrderStatuses.ON_HOLD) {
        result.onHold = item.count;
        result.statusDistribution.onHold = {
          count: item.count,
          percentage:
            total > 0 ? Math.round((item.count / total) * 1000) / 10 : 0,
        };
      } else if (item.status === UpdateOrderStatuses.DELIVERED) {
        result.delivered = item.count;
        result.statusDistribution.delivered = {
          count: item.count,
          percentage:
            total > 0 ? Math.round((item.count / total) * 1000) / 10 : 0,
        };
      } else if (item.status === OrderStatus.PROCESSING) {
        result.processing = item.count;
        result.statusDistribution.processing = {
          count: item.count,
          percentage:
            total > 0 ? Math.round((item.count / total) * 1000) / 10 : 0,
        };
      }
    });

    return result;
  }
}
