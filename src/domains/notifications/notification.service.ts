import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  NotificationActivityLog,
  NotificationActivityLogDocument,
} from './schema/notification-log.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationEvent } from 'src/events/log-notification.event';
import { NotificationResponseDto } from './types';

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

  async getNotifications(): Promise<NotificationResponseDto[]> {
    try {
      const notifications = await this.notificationLogModel
        .find()
        .sort({ sent_at: -1 });
      return notifications.map((notification) => ({
        order_id: notification.order_id,
        recipient_email: notification.recipient_email,
        subject: notification.subject,
        status: notification.status,
        sent_at: notification.sent_at,
      }));
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
