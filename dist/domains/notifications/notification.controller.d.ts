import { NotificationService } from './notification.service';
import { ResponsePayload } from '../types';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(): Promise<ResponsePayload>;
}
