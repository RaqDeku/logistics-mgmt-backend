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
exports.orderActivitySchema = exports.OrderActivity = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const admin_schema_1 = require("../../auth/schema/admin.schema");
const constants_1 = require("../constants");
let OrderActivity = class OrderActivity {
    order_id;
    status;
    reason;
    notes;
    duration;
    estimated_delivery_date;
    location;
    date;
    admin;
};
exports.OrderActivity = OrderActivity;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], OrderActivity.prototype, "order_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: [
            ...Object.values(constants_1.OrderStatus),
            ...Object.values(constants_1.UpdateOrderStatuses),
        ],
        index: true,
    }),
    __metadata("design:type", String)
], OrderActivity.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], OrderActivity.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], OrderActivity.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], OrderActivity.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], OrderActivity.prototype, "estimated_delivery_date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], OrderActivity.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], OrderActivity.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: admin_schema_1.Admin.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OrderActivity.prototype, "admin", void 0);
exports.OrderActivity = OrderActivity = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], OrderActivity);
exports.orderActivitySchema = mongoose_1.SchemaFactory.createForClass(OrderActivity);
//# sourceMappingURL=order.activities.schema.js.map