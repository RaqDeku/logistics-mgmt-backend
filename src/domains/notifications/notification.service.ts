import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  NotificationActivityLog,
  NotificationActivityLogDocument,
} from './schema/notification-log.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationEvent } from 'src/events/log-notification.event';
import { NotificationResponseDto } from './types';

interface AdminPayload {
  id: string;
  email: string;
}
@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationActivityLog.name)
    private readonly notificationLogModel: Model<NotificationActivityLogDocument>,
  ) {}

  @OnEvent('email.sent', { async: true })
  async saveNotificationLog(event: NotificationEvent) {
    try {
      const notificationLog = new this.notificationLogModel({
        order_id: event.order_id,
        recipient_email: event.recipient_email,
        subject: event.subject,
        status: event.status,
        sent_at: event.sent_at,
      });
      await notificationLog.save();
      return;
    } catch (error) {
      console.log(error);
    }
  }

  async getNotifications(
    admin: AdminPayload,
  ): Promise<NotificationResponseDto[]> {
    try {
      const notifications = await this.notificationLogModel
        .aggregate([
          // Join with orders
          {
            $lookup: {
              from: 'orders',
              localField: 'order_id',
              foreignField: 'order_id',
              as: 'order',
            },
          },
          { $unwind: '$order' },

          // Join with order_activities
          {
            $lookup: {
              from: 'order_activities',
              localField: 'order.order_id',
              foreignField: 'order_id',
              as: 'activities',
            },
          },
          { $match: { 'activities.admin': new Types.ObjectId(admin.id) } },
          { $sort: { sent_at: -1 } },
          {
            $project: {
              _id: 0,
              order_id: 1,
              recipient_email: 1,
              subject: 1,
              status: 1,
              sent_at: 1,
            },
          },
        ])
        .exec();

      return notifications;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
