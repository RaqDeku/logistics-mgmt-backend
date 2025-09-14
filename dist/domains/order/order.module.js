"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const common_1 = require("@nestjs/common");
const orders_controller_1 = require("./orders.controller");
const orders_service_1 = require("./orders.service");
const mongoose_1 = require("@nestjs/mongoose");
const order_schema_1 = require("./schema/order.schema");
const reciever_schema_1 = require("./schema/reciever.schema");
const order_activities_schema_1 = require("./schema/order.activities.schema");
const analytics_service_1 = require("./analytics.service");
const sender_schema_1 = require("./schema/sender.schema");
const receipt_service_1 = require("./receipt.service");
const company_profile_schema_1 = require("../setting/schema/company-profile.schema");
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: order_schema_1.Order.name, schema: order_schema_1.orderSchema },
                { name: reciever_schema_1.Receiver.name, schema: reciever_schema_1.receiverSchema },
                { name: order_activities_schema_1.OrderActivity.name, schema: order_activities_schema_1.orderActivitySchema },
                { name: sender_schema_1.Sender.name, schema: sender_schema_1.SenderSchema },
                { name: company_profile_schema_1.CompanyProfile.name, schema: company_profile_schema_1.CompanyProfileSchema },
            ]),
        ],
        controllers: [orders_controller_1.OrdersController],
        providers: [orders_service_1.OrdersService, analytics_service_1.OrderAnalyticsService, receipt_service_1.ReceiptService],
    })
], OrderModule);
//# sourceMappingURL=order.module.js.map