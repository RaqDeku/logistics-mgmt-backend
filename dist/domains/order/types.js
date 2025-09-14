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
exports.TrackOrderResponseDto = exports.TrackOrderTimelineItemDto = exports.GetOrderByIdResponseDto = exports.CurrentHoldActivityDto = exports.OrderResponseDto = exports.ItemInformation = exports.SenderInformation = exports.ReceiverInformation = exports.Address = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class Address {
    city;
    state;
    country;
    address;
    zip_code;
}
exports.Address = Address;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The receiver's city/town",
        example: 'Kumasi',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The receiver's state",
        example: 'Ashanti region',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Address.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The receiver's country",
        example: 'Ghana',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Address.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The receiver's pick up location/street address",
        example: 'house no 8, knust avenue',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Address.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The receiver's zip code",
        example: '00233',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Address.prototype, "zip_code", void 0);
class ReceiverInformation {
    full_name;
    mobile_number;
    email;
    address;
}
exports.ReceiverInformation = ReceiverInformation;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The receiver's full name",
        example: 'Joe Doe',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiverInformation.prototype, "full_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The receiver's phone number",
        example: '+233 200000001',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReceiverInformation.prototype, "mobile_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The receiver's email",
        example: 'receiver@gmail.com',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ReceiverInformation.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The receiver's address",
        type: Address,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Address)
], ReceiverInformation.prototype, "address", void 0);
class SenderInformation {
    full_name;
    mobile_number;
    email;
    address;
}
exports.SenderInformation = SenderInformation;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The sender's full name",
        example: 'John Andy',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SenderInformation.prototype, "full_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The sender's phone number",
        example: '+233 200000002',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SenderInformation.prototype, "mobile_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The sender's email",
        example: 'sender@gmail.com',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SenderInformation.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The sender's address",
        type: Address,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Address)
], SenderInformation.prototype, "address", void 0);
class ItemInformation {
    item_type;
    item_description;
    net_weight;
    estimated_delivery_date;
    revenue;
    estimated_value;
}
exports.ItemInformation = ItemInformation;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The item type',
        example: 'Gold Necklace',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ItemInformation.prototype, "item_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The item description',
        example: 'This is a 24k Gold Necklace',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], ItemInformation.prototype, "item_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The item net weight',
        example: '50 g',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ItemInformation.prototype, "net_weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The item's estimated delivery date",
        example: '2025-01-01',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)({ strict: true }),
    __metadata("design:type", Date)
], ItemInformation.prototype, "estimated_delivery_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The item's estimated revenue",
        example: '100.00',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ItemInformation.prototype, "revenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The item's declared value",
        example: '100.00',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ItemInformation.prototype, "estimated_value", void 0);
class OrderResponseDto {
    order_id;
    item_type;
    sender;
    receiver;
    estimated_delivery_date;
    status;
    is_on_hold;
    hold_reason;
    hold_duration;
    notes;
}
exports.OrderResponseDto = OrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The unique ID of the order',
        example: 'ORD-1672531200000-abcdef123',
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The type of item in the order',
        example: 'Electronics',
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "item_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "The sender's full name", example: 'John Andy' }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "sender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The receiver's full name",
        example: 'Joe Doe',
        nullable: true,
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "receiver", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The estimated delivery date of the order',
        example: '2025-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "estimated_delivery_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the order',
        example: 'In Transit',
        nullable: true,
    }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if the order is on hold',
        example: false,
    }),
    __metadata("design:type", Boolean)
], OrderResponseDto.prototype, "is_on_hold", void 0);
class CurrentHoldActivityDto {
    order_id;
    status;
    reason;
    notes;
    duration;
    date;
    placedBy;
}
exports.CurrentHoldActivityDto = CurrentHoldActivityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ORD-1672531200000-abcdef123' }),
    __metadata("design:type", String)
], CurrentHoldActivityDto.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'On Hold' }),
    __metadata("design:type", String)
], CurrentHoldActivityDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: 'Customer requested reschedule',
        description: 'Reason for the order being on hold.',
    }),
    __metadata("design:type", String)
], CurrentHoldActivityDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: 'Call before arrival',
        description: 'Additional notes for the activity.',
    }),
    __metadata("design:type", String)
], CurrentHoldActivityDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: 48,
        description: 'Duration of the hold in hours.',
    }),
    __metadata("design:type", Number)
], CurrentHoldActivityDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The date and time of this activity.' }),
    __metadata("design:type", Date)
], CurrentHoldActivityDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The admin who performed this activity.',
        example: 'Admin User',
    }),
    __metadata("design:type", String)
], CurrentHoldActivityDto.prototype, "placedBy", void 0);
class GetOrderByIdResponseDto {
    order_id;
    item_type;
    item_description;
    net_weight;
    receiver;
    sender;
    estimated_delivery_date;
    revenue;
    estimated_value;
    order_status;
    current_hold;
}
exports.GetOrderByIdResponseDto = GetOrderByIdResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ORD-1672531200000-abcdef123' }),
    __metadata("design:type", String)
], GetOrderByIdResponseDto.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Electronics' }),
    __metadata("design:type", String)
], GetOrderByIdResponseDto.prototype, "item_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A brand new laptop' }),
    __metadata("design:type", String)
], GetOrderByIdResponseDto.prototype, "item_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2.5kg' }),
    __metadata("design:type", String)
], GetOrderByIdResponseDto.prototype, "net_weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ReceiverInformation }),
    __metadata("design:type", ReceiverInformation)
], GetOrderByIdResponseDto.prototype, "receiver", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SenderInformation }),
    __metadata("design:type", SenderInformation)
], GetOrderByIdResponseDto.prototype, "sender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], GetOrderByIdResponseDto.prototype, "estimated_delivery_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 250.5 }),
    __metadata("design:type", Number)
], GetOrderByIdResponseDto.prototype, "revenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1200 }),
    __metadata("design:type", Number)
], GetOrderByIdResponseDto.prototype, "estimated_value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'In Transit',
        nullable: true,
        description: 'The latest status of the order.',
    }),
    __metadata("design:type", String)
], GetOrderByIdResponseDto.prototype, "order_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: CurrentHoldActivityDto,
        required: false,
        nullable: true,
        description: 'Details of the hold, if the order is currently on hold.',
    }),
    __metadata("design:type", CurrentHoldActivityDto)
], GetOrderByIdResponseDto.prototype, "current_hold", void 0);
class TrackOrderTimelineItemDto {
    status;
    date;
    reason;
    location;
    notes;
    duration;
}
exports.TrackOrderTimelineItemDto = TrackOrderTimelineItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The status of the order at this point in time.',
        example: 'In Transit',
    }),
    __metadata("design:type", String)
], TrackOrderTimelineItemDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The date of this activity.',
        example: '2025-01-01T10:00:00.000Z',
    }),
    __metadata("design:type", Date)
], TrackOrderTimelineItemDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for the status, if any.',
        example: 'Departed from facility',
        required: false,
    }),
    __metadata("design:type", String)
], TrackOrderTimelineItemDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Location of package at time of update.',
        example: 'Kumasi, Ghana',
        required: false,
    }),
    __metadata("design:type", String)
], TrackOrderTimelineItemDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes for the activity.',
        example: 'Package is on its way to the final destination.',
        required: false,
    }),
    __metadata("design:type", String)
], TrackOrderTimelineItemDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Duration associated with the status (e.g., for hold in hours).',
        example: 24,
        required: false,
    }),
    __metadata("design:type", Number)
], TrackOrderTimelineItemDto.prototype, "duration", void 0);
class TrackOrderResponseDto {
    order_id;
    item_type;
    estimated_delivery_date;
    status;
    timeline;
}
exports.TrackOrderResponseDto = TrackOrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The unique ID of the order.',
        example: 'ORD-1672531200000-abcdef123',
    }),
    __metadata("design:type", String)
], TrackOrderResponseDto.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The type of item in the order.',
        example: 'Electronics',
    }),
    __metadata("design:type", String)
], TrackOrderResponseDto.prototype, "item_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The estimated delivery date of the order.',
        example: '2025-01-10T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], TrackOrderResponseDto.prototype, "estimated_delivery_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the order.',
        example: 'In Transit',
        nullable: true,
    }),
    __metadata("design:type", String)
], TrackOrderResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'A chronological list of all activities for the order.',
        type: [TrackOrderTimelineItemDto],
    }),
    __metadata("design:type", Array)
], TrackOrderResponseDto.prototype, "timeline", void 0);
//# sourceMappingURL=types.js.map