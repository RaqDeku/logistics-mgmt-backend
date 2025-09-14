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
exports.orderSchema = exports.Order = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const reciever_schema_1 = require("./reciever.schema");
const order_activities_schema_1 = require("./order.activities.schema");
const sender_schema_1 = require("./sender.schema");
let Order = class Order {
    item_type;
    item_description;
    net_weight;
    receiver;
    sender;
    estimated_delivery_date;
    revenue;
    estimated_value;
    order_id;
    order_activities;
};
exports.Order = Order;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Order.prototype, "item_type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Order.prototype, "item_description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Order.prototype, "net_weight", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: reciever_schema_1.Receiver.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "receiver", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: sender_schema_1.Sender.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "sender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date }),
    __metadata("design:type", Date)
], Order.prototype, "estimated_delivery_date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Order.prototype, "revenue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Order.prototype, "estimated_value", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, index: true }),
    __metadata("design:type", String)
], Order.prototype, "order_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: [{ type: mongoose_2.Types.ObjectId, ref: order_activities_schema_1.OrderActivity.name }],
    }),
    __metadata("design:type", Array)
], Order.prototype, "order_activities", void 0);
exports.Order = Order = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Order);
exports.orderSchema = mongoose_1.SchemaFactory.createForClass(Order);
exports.orderSchema.pre('save', async function (next) {
    const order = this;
    if (!this.isNew)
        return next();
    try {
        order.order_id = createOrderId();
        next();
    }
    catch (error) {
        next(error);
    }
});
function createOrderId() {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
//# sourceMappingURL=order.schema.js.map