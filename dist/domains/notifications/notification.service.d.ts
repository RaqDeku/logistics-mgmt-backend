import { NotificationActivityLogDocument } from './schema/notification-log.schema';
import { Model } from 'mongoose';
import { NotificationEvent } from 'src/events/log-notification.event';
import { NotificationResponseDto } from './types';
export declare class NotificationService {
    private readonly notificationLogModel;
    constructor(notificationLogModel: Model<NotificationActivityLogDocument>);
    saveNotificationLog(event: NotificationEvent): Promise<void>;
    getNotifications(): Promise<NotificationResponseDto[]>;
}
