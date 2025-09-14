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
exports.CreateOrdersDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const types_1 = require("../types");
const class_validator_1 = require("class-validator");
class CreateOrdersDto {
    items_info;
    receiver_info;
    sender_info;
}
exports.CreateOrdersDto = CreateOrdersDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The order details',
        type: [types_1.ItemInformation],
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateOrdersDto.prototype, "items_info", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The receiver information',
        type: types_1.ReceiverInformation,
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", types_1.ReceiverInformation)
], CreateOrdersDto.prototype, "receiver_info", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The sender information',
        type: types_1.SenderInformation,
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", types_1.SenderInformation)
], CreateOrdersDto.prototype, "sender_info", void 0);
//# sourceMappingURL=create-order.dto.js.map