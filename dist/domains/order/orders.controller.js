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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/auth.guard");
const update_status_dto_1 = require("./dto/update-status.dto");
const types_1 = require("./types");
const analytics_service_1 = require("./analytics.service");
const types_2 = require("../types");
const receipt_service_1 = require("./receipt.service");
const express_1 = __importDefault(require("express"));
let OrdersController = class OrdersController {
    orderService;
    analyticsService;
    receiptService;
    constructor(orderService, analyticsService, receiptService) {
        this.orderService = orderService;
        this.analyticsService = analyticsService;
        this.receiptService = receiptService;
    }
    async create(createOrdersDto, req) {
        const admin = req['user'];
        const res = await this.orderService.createOrders(createOrdersDto, admin);
        return {
            message: 'Order created successfully',
            data: res,
        };
    }
    async findAll() {
        const res = await this.orderService.getAllOrders();
        return {
            message: 'Orders retrieved successfully',
            data: res,
        };
    }
    async analytics() {
        const res = await this.analyticsService.analytics();
        return {
            data: res,
        };
    }
    async generateReceipt(order_id, res) {
        const receiptBuffer = await this.receiptService.getReceipt(order_id);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=receipt.pdf');
        return {
            data: res.end(receiptBuffer),
        };
    }
    async findOrder(order_id) {
        const res = await this.orderService.getOrderById(order_id);
        return {
            data: res,
        };
    }
    async track(order_id) {
        const res = await this.orderService.trackOrder(order_id);
        return {
            message: 'Tracking details retrieved successfully',
            data: res,
        };
    }
    async update(order_id) { }
    async updateStatus(order_id, updateOrderStatus, req) {
        const admin = req['user'];
        const res = await this.orderService.updateOrderStatus(order_id, updateOrderStatus, admin);
        return {
            message: res,
        };
    }
    async delete(order_id) {
        const res = await this.orderService.deleteOrder(order_id);
        return {
            message: res,
        };
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new order to deliver' }),
    (0, swagger_1.ApiBody)({ type: create_order_dto_1.CreateOrdersDto, description: 'Order details' }),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Order created successfully',
        type: types_2.ResponsePayload,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrdersDto,
        Request]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders with receiver details' }),
    (0, swagger_1.ApiOkResponse)({
        type: [types_1.OrderResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get analytics of all orders' }),
    (0, swagger_1.ApiOkResponse)({
        type: types_2.ResponsePayload,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "analytics", null);
__decorate([
    (0, common_1.Get)('/receipt/:order_id'),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a receipt for an order' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'The order receipt detail.',
        type: types_1.GetOrderByIdResponseDto,
    }),
    __param(0, (0, common_1.Param)('order_id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "generateReceipt", null);
__decorate([
    (0, common_1.Get)(':order_id'),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an order details' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'The order details.',
        type: types_1.GetOrderByIdResponseDto,
    }),
    __param(0, (0, common_1.Param)('order_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOrder", null);
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Get)('track/:order_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tracking details of the order' }),
    (0, swagger_1.ApiOkResponse)({
        type: types_1.TrackOrderResponseDto,
    }),
    __param(0, (0, common_1.Param)('order_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "track", null);
__decorate([
    (0, common_1.Put)(':order_id'),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    __param(0, (0, common_1.Param)('order_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('status/:order_id'),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    (0, swagger_1.ApiOperation)({ summary: 'Update the status of an order' }),
    (0, swagger_1.ApiBody)({
        description: 'Order update details',
        type: update_status_dto_1.UpdateOrderStatus,
    }),
    (0, swagger_1.ApiOkResponse)({
        type: types_2.ResponsePayload,
    }),
    __param(0, (0, common_1.Param)('order_id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_status_dto_1.UpdateOrderStatus,
        Request]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)('/:order_id'),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an order' }),
    (0, swagger_1.ApiOkResponse)({
        type: types_2.ResponsePayload,
    }),
    __param(0, (0, common_1.Param)('order_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "delete", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        analytics_service_1.OrderAnalyticsService,
        receipt_service_1.ReceiptService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map