import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Connection } from 'mongoose';
import {
  OrderActivity,
  OrderActivityDocument,
} from './schema/order.activities.schema';
import { Order, OrderDocument } from './schema/order.schema';
import { OrderStatus, UpdateOrderStatuses } from './constants';

interface AdminPayload {
  id: string;
  email: string;
}
@Injectable()
export class OrderAnalyticsService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(OrderActivity.name)
    private readonly orderActivityModel: Model<OrderActivityDocument>,
  ) {}

  async getOrderStats(admin: AdminPayload, startOfYear: Date) {
    const stats = await this.orderModel
      .aggregate([
        { $match: { admin_id: admin.id } },
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
            currentStatus: { $arrayElemAt: ['$activities.status', 0] },
            deliveryDate: {
              $cond: [
                {
                  $eq: [
                    { $arrayElemAt: ['$activities.status', 0] },
                    UpdateOrderStatuses.DELIVERED,
                  ],
                },
                { $arrayElemAt: ['$activities.date', 0] },
                null,
              ],
            },
          },
        },
        {
          $addFields: {
            deliveryTime: {
              $cond: [
                { $ne: ['$deliveryDate', null] },
                {
                  $divide: [
                    { $subtract: ['$deliveryDate', '$createdAt'] },
                    86400000,
                  ],
                },
                null,
              ],
            },
          },
        },
        {
          $facet: {
            statusCounts: [
              { $group: { _id: '$currentStatus', count: { $sum: 1 } } },
              { $project: { _id: 0, status: '$_id', count: 1 } },
            ],
            total: [{ $count: 'total' }],
            avgDeliveryTime: [
              { $match: { deliveryTime: { $ne: null } } },
              { $group: { _id: null, avg: { $avg: '$deliveryTime' } } },
              {
                $project: { _id: 0, avgDeliveryTime: { $round: ['$avg', 1] } },
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
                        $multiply: [{ $divide: ['$delivered', '$total'] }, 100],
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
                  totalRevenue: { $sum: { $ifNull: ['$revenue', 0] } },
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
                  revenue: { $sum: { $ifNull: ['$revenue', 0] } },
                },
              },
              { $sort: { _id: 1 } },
              { $project: { _id: 0, month: '$_id', shipments: 1, revenue: 1 } },
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
      .exec();

    return stats[0] || {};
  }

  async getRecentActivities(admin: AdminPayload) {
    return this.orderActivityModel
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
          $match: {
            'orderInfo.admin_id': admin.id,
          },
        },
        {
          $lookup: {
            from: 'admins',
            let: { adminIdStr: '$admin' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: '$_id' }, { $toString: '$$adminIdStr' }],
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
                $match: {
                  $expr: {
                    $eq: [{ $toString: '$_id' }, { $toString: '$$receiverId' }],
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
          $project: {
            _id: 0,
            description: {
              $concat: [
                'Package ',
                { $toString: { $ifNull: ['$orderInfo.order_id', 'Unknown'] } },
                ' ',
                { $toLower: '$status' },
                {
                  $cond: [
                    { $eq: ['$status', UpdateOrderStatuses.DELIVERED] },
                    {
                      $concat: [
                        ' to ',
                        {
                          $ifNull: [
                            '$orderInfo.receiverInfo.full_name',
                            'Unknown Destination',
                          ],
                        },
                      ],
                    },
                    '',
                  ],
                },
                {
                  $cond: [
                    { $eq: ['$status', UpdateOrderStatuses.ON_HOLD] },
                    { $concat: [' - ', { $toString: '$reason' }] },
                    '',
                  ],
                },
                {
                  $cond: [
                    {
                      $and: [
                        { $eq: ['$status', UpdateOrderStatuses.IN_TRANSIT] },
                        { $ne: ['$reason', ''] },
                      ],
                    },
                    { $concat: [' - ', { $ifNull: ['$reason', ''] }] },
                    '',
                  ],
                },
              ],
            },
            by: { $ifNull: ['$adminInfo.full_name', 'Admin User'] },
            date: { $dateToString: { format: '%d %b', date: '$date' } },
          },
        },
      ])
      .exec();
  }

  async analytics(admin: AdminPayload) {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [stats, recentActivities] = await Promise.all([
      this.getOrderStats(admin, startOfYear),
      this.getRecentActivities(admin),
    ]);

    // Fill in months
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
    const fullMonthly = monthNames.map((m, i) => {
      const monthStr = (i + 1).toString().padStart(2, '0');
      const found = (stats.monthlyPerformance || []).find(
        (mp) => mp.month === monthStr,
      );
      return {
        month: m,
        shipments: found?.shipments || 0,
        revenue: found?.revenue || 0,
      };
    });

    const result = {
      totalShipments: stats.total || 0,
      avgDeliveryTime: stats.avgDeliveryTime || 0,
      deliverySuccessRate: stats.deliverySuccessRate || 0,
      revenueOverview: {
        totalRevenue: stats.revenueOverview?.totalRevenue || 0,
        averagePerShipment: stats.revenueOverview?.averagePerShipment || 0,
      },
      monthlyPerformance: fullMonthly,
      recentActivities,

      // init counters
      inTransit: 0,
      onHold: 0,
      delivered: 0,
      processing: 0,
      statusDistribution: {
        inTransit: { count: 0, percentage: 0 },
        onHold: { count: 0, percentage: 0 },
        delivered: { count: 0, percentage: 0 },
        processing: { count: 0, percentage: 0 },
      },
    };

    // Map statuses
    const statusMap = {
      [UpdateOrderStatuses.IN_TRANSIT]: 'inTransit',
      [UpdateOrderStatuses.ON_HOLD]: 'onHold',
      [UpdateOrderStatuses.DELIVERED]: 'delivered',
      [OrderStatus.PROCESSING]: 'processing',
    };

    const total = result.totalShipments;
    (stats.statusCounts || []).forEach(({ status, count }) => {
      const key = statusMap[status];
      if (!key) return;
      result[key] = count;
      result.statusDistribution[key] = {
        count,
        percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
      };
    });

    return result;
  }
}
