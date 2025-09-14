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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class NotificationResponseDto {
    order_id;
    recipient_email;
    subject;
    status;
    sent_at;
}
exports.NotificationResponseDto = NotificationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the order associated with the notification.',
        example: 'ORD-1672531200000-abcdef123',
    }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The email address of the recipient.',
        example: 'receiver@gmail.com',
    }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "recipient_email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The subject of the notification email.',
        example: 'Order Created Successfully!',
    }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The status of the notification (e.g., success, failed).',
        example: 'success',
    }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The timestamp when the notification was sent.',
        example: '2025-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "sent_at", void 0);
//# sourceMappingURL=types.js.map