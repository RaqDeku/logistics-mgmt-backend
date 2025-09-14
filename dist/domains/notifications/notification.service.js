"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const notification_log_schema_1 = require("./schema/notification-log.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const event_emitter_1 = require("@nestjs/event-emitter");
const log_notification_event_1 = require("../../events/log-notification.event");
let NotificationService = class NotificationService {
    notificationLogModel;
    constructor(notificationLogModel) {
        this.notificationLogModel = notificationLogModel;
    }
    async saveNotificationLog(event) {
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
        }
        catch (error) {
            console.log(error);
        }
    }
    async getNotifications() {
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
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Something went wrong');
        }
    }
};
exports.NotificationService = NotificationService;
__decorate([
    (0, event_emitter_1.OnEvent)('email.sent', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [log_notification_event_1.NotificationEvent]),
    __metadata("design:returntype", Promise)
], NotificationService.prototype, "saveNotificationLog", null);
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(notification_log_schema_1.NotificationActivityLog.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], NotificationService);
//# sourceMappingURL=notification.service.js.map