import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import {
  OrderActivity,
  OrderActivityDocument,
} from './schema/order.activities.schema';
import { Order, OrderDocument } from './schema/order.schema';
import { OrderStatus, UpdateOrderStatuses } from './constants';

@Injectable()
export class OrderAnalyticsService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(OrderActivity.name)
    private readonly orderActivityModel: Model<OrderActivityDocument>,
  ) {}

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
