"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const reset_password_event_1 = require("../../events/reset-password.event");
const nodemailer = __importStar(require("nodemailer"));
const order_created_event_1 = require("../../events/order-created.event");
const order_on_hold_event_1 = require("../../events/order-on-hold.event");
const order_in_transit_event_1 = require("../../events/order-in-transit.event");
const order_delivered_event_1 = require("../../events/order-delivered.event");
const log_notification_event_1 = require("../../events/log-notification.event");
const contact_team_event_1 = require("../../events/contact.team.event");
let EmailService = class EmailService {
    eventEmitter;
    transporter;
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async handleResetPasswordEvent(event) {
        const { email, token } = event;
        try {
            await this.transporter.sendMail({
                from: process.env.FROM_EMAIL,
                to: email,
                subject: 'Password Reset Request',
                html: `
          <p>You requested a password reset for your account.</p>
          <p>Please use the following token: <strong>${token}</strong></p>
          
          <p>This link expires in 15 minutes.</p>
        `,
            });
        }
        catch (error) {
            console.error('Error sending password reset email:', error);
        }
    }
    emitNotificationEvent(order_id, recipient_email, subject, status) {
        const notificationEvent = new log_notification_event_1.NotificationEvent();
        notificationEvent.order_id = order_id;
        notificationEvent.recipient_email = recipient_email;
        notificationEvent.subject = subject;
        notificationEvent.status = status;
        notificationEvent.sent_at = new Date();
        this.eventEmitter.emit('email.sent', notificationEvent);
    }
    async handleOrderCreatedEvent(event) {
        const { receiver_email, id, type, estimated_delivery_date, status, net_weight, receiver_name, } = event;
        try {
            await this.transporter.sendMail({
                from: process.env.FROM_EMAIL,
                to: receiver_email,
                subject: 'Order Created Successfully!',
                html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 20px;">
              <tr>
                <td align="center">
                  <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #007bff; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">OceanLink Logistics Ltd</h1>
                      </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                      <td style="padding: 30px;">
                        <h2 style="color: #333333; font-size: 20px; margin: 0 0 20px;">Order Created Successfully!</h2>
                        <p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                          Dear ${receiver_name},
                        </p>
                        <p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                          We’re pleased to inform you that your order has been successfully created. Below are the details of your order:
                        </p>
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 20px;">
                          <tr>
                            <td style="padding: 10px; background-color: #f9f9f9; font-size: 16px; font-weight: bold; color: #333333;">Order ID:</td>
                            <td style="padding: 10px; font-size: 16px; color: #555555;">${id}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px; background-color: #f9f9f9; font-size: 16px; font-weight: bold; color: #333333;">Item Type:</td>
                            <td style="padding: 10px; font-size: 16px; color: #555555;">${type}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px; background-color: #f9f9f9; font-size: 16px; font-weight: bold; color: #333333;">Net Weight:</td>
                            <td style="padding: 10px; font-size: 16px; color: #555555;">${net_weight}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px; background-color: #f9f9f9; font-size: 16px; font-weight: bold; color: #333333;">Estimated Delivery Date:</td>
                            <td style="padding: 10px; font-size: 16px; color: #555555;">${estimated_delivery_date}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px; background-color: #f9f9f9; font-size: 16px; font-weight: bold; color: #333333;">Status:</td>
                            <td style="padding: 10px; font-size: 16px; color: #555555;">${status}</td>
                          </tr>
                        </table>
                        <p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                          You will receive further updates as your order progresses. If you have any questions, feel free to contact our support team.
                        </p>
                        <p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 0;">
                          Thank you for choosing OceanLink Logistics Ltd
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
            });
            this.emitNotificationEvent(id, receiver_email, 'Order Created Successfully!', 'success');
        }
        catch (error) {
            this.emitNotificationEvent(id, receiver_email, 'Order Created Successfully!', 'failed');
            console.error('Error sending order creation email:', error);
        }
    }
    async handleOrderOnHoldEvent(event) {
        const { id, receiver_email, receiver_name, reason, duration, notes } = event;
        try {
            await this.transporter.sendMail({
                from: process.env.FROM_EMAIL,
                to: receiver_email,
                subject: `Your Shipment ${id} is On Hold`,
                html: `
        <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body>
            <p>Dear ${receiver_name}, </p>
            <p>Your shipment with tracking number <strong>${id}</strong> has been placed on hold.</p>
            ${reason ? `<p>Reason: ${reason}</p>` : ''}
            ${duration ? `<p>Expected Duration: ${duration}</p>` : ''}
            ${notes ? `<p>Additional Notes: ${notes}</p>` : ''}
            <p>We will notify you once your shipment is released.</p>
            <p>Best regards,</p>
            <p>OceanLink Logistics Ltd</p>
          </body>
          </html>
        `,
            });
            this.emitNotificationEvent(id, receiver_email, `Your Shipment ${id} is On Hold`, 'success');
        }
        catch (error) {
            this.emitNotificationEvent(id, receiver_email, `Your Shipment ${id} is On Hold`, 'failed');
            console.error('Error sending order on hold email:', error);
        }
    }
    async handleOrderInTransitEvent(event) {
        const { id, receiver_email, receiver_name, notes } = event;
        try {
            await this.transporter.sendMail({
                from: process.env.FROM_EMAIL,
                to: receiver_email,
                subject: `Your Shipment ${id} is In Transit`,
                html: `
        <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body>
            <p>Dear ${receiver_name}, </p>
            <p> Your shipment with tracking number <strong>${id}</strong> is in transit. </p>
            ${notes ? `<p>Additional Notes: ${notes}</p>` : ''}
        
            <p>Best regards, </p>
            <p>OceanLink Logistics Ltd</p>
          </body>
          </html>
        `,
            });
            this.emitNotificationEvent(id, receiver_email, `Your Shipment ${id} is In Transit`, 'success');
        }
        catch (error) {
            this.emitNotificationEvent(id, receiver_email, `Your Shipment ${id} is In Transit`, 'failed');
            console.error('Error sending order in transit email:', error);
        }
    }
    async handleOrderDeliveredEvent(event) {
        const { id, receiver_email, receiver_name, delivery_date } = event;
        try {
            await this.transporter.sendMail({
                from: process.env.FROM_EMAIL,
                to: receiver_email,
                subject: `Your Shipment ${id} has been delivered`,
                html: `
        <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body>
            <p>Dear ${receiver_name}, </p>
            <p> Your shipment with tracking number <strong>${id}</strong> has been delivered. </p>
            <p>Delivery Date: ${delivery_date} </p>
            <p>Received By: ${receiver_name} </p>

            <p>Thank you for choosing OceanLink Logistics Ltd. </p>

            <p>Best regards, </p>
            <p>OceanLink Logistics Ltd</p>
            </body>
          </html>
        `,
            });
            this.emitNotificationEvent(id, receiver_email, `Your Shipment ${id} has been delivered`, 'success');
        }
        catch (error) {
            this.emitNotificationEvent(id, receiver_email, `Your Shipment ${id} has been delivered`, 'failed');
            console.error('Error sending order in transit email:', error);
        }
    }
    async handleContactTeamEvent(event) {
        const { email, message, name, team_email } = event;
        try {
            await this.transporter.sendMail({
                from: process.env.FROM_EMAIL,
                to: team_email,
                subject: `Contact message from website`,
                html: `
        <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body>
            <p>From: ${name} </p>
            <p>Email: ${email} </p>
            <p>Message: ${message} </p>
            </body>
          </html>
        `,
            });
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.EmailService = EmailService;
__decorate([
    (0, event_emitter_1.OnEvent)('reset.password', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_event_1.ResetPasswordEvent]),
    __metadata("design:returntype", Promise)
], EmailService.prototype, "handleResetPasswordEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('order.created', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_created_event_1.OrderCreatedEvent]),
    __metadata("design:returntype", Promise)
], EmailService.prototype, "handleOrderCreatedEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('order.updated.on-hold', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_on_hold_event_1.OrderOnHoldEvent]),
    __metadata("design:returntype", Promise)
], EmailService.prototype, "handleOrderOnHoldEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('order.updated.in-transit', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_in_transit_event_1.OrderInTransitEvent]),
    __metadata("design:returntype", Promise)
], EmailService.prototype, "handleOrderInTransitEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('order.updated.delivered', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_delivered_event_1.OrderDeliveredEvent]),
    __metadata("design:returntype", Promise)
], EmailService.prototype, "handleOrderDeliveredEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('contact.team', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contact_team_event_1.ContactTeamEvent]),
    __metadata("design:returntype", Promise)
], EmailService.prototype, "handleContactTeamEvent", null);
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], EmailService);
//# sourceMappingURL=email.service.js.map