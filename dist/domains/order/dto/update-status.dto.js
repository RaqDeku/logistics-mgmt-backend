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
exports.UpdateOrderStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const constants_1 = require("../constants");
const allStatuses = { ...constants_1.UpdateOrderStatuses };
class UpdateOrderStatus {
    status;
    reason;
    notes;
    duration;
    location;
    estimated_delivery_date;
}
exports.UpdateOrderStatus = UpdateOrderStatus;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The new status of the order.',
        enum: allStatuses,
    }),
    (0, class_validator_1.IsEnum)(allStatuses, {
        message: `Status must be one of the following: ${Object.values(allStatuses).join(', ')}`,
    }),
    __metadata("design:type", String)
], UpdateOrderStatus.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'A reason for the status update, especially for "On Hold" status.',
        example: 'Customer not available at the location.',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderStatus.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about the activity, e.g., delivery instructions or observations.',
        example: 'Package left with the receptionist as requested.',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderStatus.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The duration for which the status is applicable, e.g., for "On Hold" status in hours.',
        example: 48,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateOrderStatus.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The location of the order during the update',
        example: 'Kumasi, Ashanti Region',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrderStatus.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The item's estimated delivery date",
        example: '2025-01-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({ strict: true }),
    __metadata("design:type", Date)
], UpdateOrderStatus.prototype, "estimated_delivery_date", void 0);
//# sourceMappingURL=update-status.dto.js.map