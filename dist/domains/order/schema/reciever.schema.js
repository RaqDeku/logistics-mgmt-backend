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
exports.receiverSchema = exports.Receiver = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../types");
let Receiver = class Receiver {
    full_name;
    mobile_number;
    email;
    address;
    orders;
};
exports.Receiver = Receiver;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Receiver.prototype, "full_name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Receiver.prototype, "mobile_number", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Receiver.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: types_1.Address }),
    __metadata("design:type", types_1.Address)
], Receiver.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: [{ type: mongoose_2.Types.ObjectId, ref: 'Order' }] }),
    __metadata("design:type", Array)
], Receiver.prototype, "orders", void 0);
exports.Receiver = Receiver = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Receiver);
exports.receiverSchema = mongoose_1.SchemaFactory.createForClass(Receiver);
//# sourceMappingURL=reciever.schema.js.map