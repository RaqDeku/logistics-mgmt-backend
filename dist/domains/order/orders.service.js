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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schema/order.schema");
const reciever_schema_1 = require("./schema/reciever.schema");
const order_created_event_1 = require("../../events/order-created.event");
const constants_1 = require("./constants");
const order_on_hold_event_1 = require("../../events/order-on-hold.event");
const order_activities_schema_1 = require("./schema/order.activities.schema");
const sender_schema_1 = require("./schema/sender.schema");
const order_in_transit_event_1 = require("../../events/order-in-transit.event");
const order_delivered_event_1 = require("../../events/order-delivered.event");
let OrdersService = class OrdersService {
    orderModel;
    receiverModel;
    orderActivityModel;
    senderModel;
    connection;
    eventEmitter;
    constructor(orderModel, receiverModel, orderActivityModel, senderModel, connection, eventEmitter) {
        this.orderModel = orderModel;
        this.receiverModel = receiverModel;
        this.orderActivityModel = orderActivityModel;
        this.senderModel = senderModel;
        this.connection = connection;
        this.eventEmitter = eventEmitter;
    }
    async createOrders(createOrderDto, admin) {
        const { items_info, receiver_info, sender_info } = createOrderDto;
        const session = await this.connection.startSession();
        try {
            const createdOrders = [];
            await session.withTransaction(async () => {
                const receiver = new this.receiverModel({
                    ...receiver_info,
                    orders: [],
                });
                await receiver.save({ session });
                const sender = new this.senderModel({
                    ...sender_info,
                    orders: [],
                });
                await sender.save({ session });
                for (const item of items_info) {
                    const order = new this.orderModel({
                        ...item,
                        estimated_delivery_date: new Date(item.estimated_delivery_date),
                        receiver: receiver.id,
                        sender: sender.id,
                        order_activities: [],
                    });
                    const savedOrder = await order.save({ session });
                    const activity = new this.orderActivityModel({
                        order_id: savedOrder.order_id,
                        status: constants_1.OrderStatus.CREATED,
                        admin: admin.id,
                        location: 'OceanLink Logistics Warehouse',
                        date: new Date(Date.now()),
                    });
                    const savedActivity = await activity.save({ session });
                    savedOrder.order_activities = [savedActivity.id];
                    await savedOrder.save({ session });
                    createdOrders.push(savedOrder);
                }
                receiver.orders = createdOrders.map((order) => order.id);
                sender.orders = createdOrders.map((order) => order.id);
                await sender.save({ session });
                await receiver.save({ session });
                createdOrders.forEach((order) => {
                    const orderEvent = new order_created_event_1.OrderCreatedEvent();
                    orderEvent.id = order.order_id;
                    orderEvent.type = order.item_type;
                    orderEvent.estimated_delivery_date =
                        order.estimated_delivery_date?.toDateString();
                    orderEvent.status = constants_1.OrderStatus.CREATED;
                    orderEvent.net_weight = order.net_weight;
                    orderEvent.receiver_email = receiver.email;
                    orderEvent.receiver_name = receiver.full_name;
                    this.eventEmitter.emit('order.created', orderEvent);
                });
            });
            return createdOrders.map((o) => ({ order_id: o.order_id }))[0];
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Something went wrong');
        }
        finally {
            await session.endSession();
        }
    }
    async getAllOrders() {
        try {
            const orders = await this.orderModel
                .find()
                .sort({ createdAt: -1 })
                .select('-createdAt -updatedAt -__v')
                .populate({
                path: 'receiver',
                select: 'full_name',
            })
                .populate({
                path: 'sender',
                select: 'full_name',
            })
                .populate({
                path: 'order_activities',
                select: 'status reason duration notes estimated_delivery_date',
                options: {
                    sort: { date: -1 },
                },
                perDocumentLimit: 1,
            })
                .exec();
            return orders.map((order) => {
                const latestActivity = order.order_activities?.[0];
                const isOnHold = latestActivity?.status === constants_1.UpdateOrderStatuses.ON_HOLD;
                return {
                    order_id: order.order_id,
                    item_type: order.item_type,
                    sender: order.sender?.full_name,
                    receiver: order.receiver?.full_name,
                    estimated_delivery_date: latestActivity?.estimated_delivery_date ??
                        order.estimated_delivery_date,
                    status: latestActivity?.status,
                    is_on_hold: isOnHold,
                    notes: latestActivity?.notes,
                    hold_reason: isOnHold ? latestActivity.reason : undefined,
                    hold_duration: isOnHold ? latestActivity.duration : undefined,
                };
            });
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Something went wrong');
        }
    }
    async getOrderById(order_id) {
        const order = await this.orderModel
            .findOne({ order_id })
            .select('-updatedAt -__v')
            .populate([
            {
                path: 'receiver',
                select: '-createdAt -updatedAt -orders -__v',
            },
            {
                path: 'sender',
                select: '-createdAt -updatedAt -orders -__v',
            },
        ])
            .populate({
            path: 'order_activities',
            select: '-__v -updatedAt',
            options: { sort: { date: -1 }, limit: 1 },
            populate: {
                path: 'admin',
                select: 'full_name',
            },
        })
            .lean()
            .exec();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const latestActivity = order.order_activities?.[0];
        const holdDetails = {
            ...latestActivity,
            placedBy: latestActivity.admin?.full_name,
            admin: undefined,
        };
        const isOnHold = latestActivity?.status === constants_1.UpdateOrderStatuses.ON_HOLD;
        return {
            order_id: order.order_id,
            item_type: order.item_type,
            item_description: order.item_description,
            net_weight: order.net_weight,
            receiver: order.receiver,
            sender: order.sender,
            estimated_delivery_date: latestActivity?.estimated_delivery_date ??
                order.estimated_delivery_date,
            revenue: order.revenue,
            estimated_value: order.estimated_value,
            order_status: latestActivity?.status ?? null,
            current_hold: isOnHold ? holdDetails : undefined,
        };
    }
    async updateOrderStatus(order_id, updateOrderStatus, admin) {
        const order = await this.orderModel
            .findOne({ order_id })
            .populate({
            path: 'order_activities',
            select: 'status',
            options: { sort: { date: -1 }, limit: 1 },
        })
            .exec();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const latestActivity = order.order_activities?.[0];
        if (latestActivity?.status === updateOrderStatus.status) {
            throw new common_1.BadRequestException('Order is already in this status');
        }
        const session = await this.connection.startSession();
        try {
            await session.withTransaction(async () => {
                const activity = new this.orderActivityModel({
                    status: updateOrderStatus.status,
                    reason: updateOrderStatus.reason,
                    notes: updateOrderStatus.notes,
                    duration: updateOrderStatus.duration,
                    location: updateOrderStatus.location,
                    estimated_delivery_date: updateOrderStatus.estimated_delivery_date
                        ? new Date(updateOrderStatus?.estimated_delivery_date)
                        : null,
                    date: new Date(Date.now()),
                    admin: admin.id,
                    order_id: order.order_id,
                });
                await activity.save({ session });
                order.order_activities = [...order.order_activities, activity.id];
                await order.save({ session });
                const receiver = await this.receiverModel
                    .findOne({ orders: { $in: [order.id] } })
                    .exec();
                this.emitOrderEvent(updateOrderStatus.status, {
                    order,
                    receiver,
                    activity,
                });
            });
            return 'Order updated successfully';
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Something went wrong');
        }
        finally {
            await session.endSession();
        }
    }
    async trackOrder(order_id) {
        const order = await this.orderModel
            .findOne({ order_id })
            .select('order_id item_type estimated_delivery_date')
            .lean()
            .exec();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const orderActivities = await this.orderActivityModel
            .find({ order_id })
            .select('status date reason notes duration location -_id')
            .sort({ date: -1 })
            .lean()
            .exec();
        return {
            ...order,
            status: orderActivities[0]?.status ?? null,
            timeline: orderActivities,
        };
    }
    async deleteOrder(order_id) {
        const order = await this.orderModel
            .findOne({ order_id })
            .populate({
            path: 'order_activities',
            select: '-__v -updatedAt',
            options: { sort: { date: -1 }, limit: 1 },
        })
            .exec();
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const latestActivity = order.order_activities?.[0];
        if ([constants_1.UpdateOrderStatuses.IN_TRANSIT, constants_1.UpdateOrderStatuses.ON_HOLD].includes(latestActivity?.status)) {
            throw new common_1.BadRequestException(`Cannot delete order at the moment`);
        }
        const session = await this.connection.startSession();
        try {
            await session.withTransaction(async () => {
                await this.orderModel.deleteOne({ order_id }, { session }).exec();
                await this.orderActivityModel
                    .deleteMany({ order_id }, { session })
                    .exec();
                await this.receiverModel
                    .deleteOne({ orders: { $in: order.id } }, { session })
                    .exec();
                await this.senderModel
                    .deleteOne({ orders: { $in: order.id } }, { session })
                    .exec();
            });
            return 'Order deleted successfully';
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Something went wrong');
        }
        finally {
            await session.endSession();
        }
    }
    async emitOrderEvent(status, { order, receiver, activity, }) {
        switch (status) {
            case constants_1.UpdateOrderStatuses.ON_HOLD: {
                const orderOnHoldEvent = new order_on_hold_event_1.OrderOnHoldEvent();
                orderOnHoldEvent.id = order.order_id;
                orderOnHoldEvent.receiver_email = receiver.email;
                orderOnHoldEvent.receiver_name = receiver.full_name;
                orderOnHoldEvent.duration = activity.duration;
                orderOnHoldEvent.notes = activity.notes;
                orderOnHoldEvent.reason = activity.reason;
                this.eventEmitter.emit('order.updated.on-hold', orderOnHoldEvent);
                break;
            }
            case constants_1.UpdateOrderStatuses.IN_TRANSIT: {
                const orderInTransitEvent = new order_in_transit_event_1.OrderInTransitEvent();
                orderInTransitEvent.id = order.order_id;
                orderInTransitEvent.receiver_email = receiver.email;
                orderInTransitEvent.receiver_name = receiver.full_name;
                orderInTransitEvent.estimated_delivery_date =
                    activity.estimated_delivery_date?.toDateString();
                orderInTransitEvent.notes = activity.notes;
                this.eventEmitter.emit('order.updated.in-transit', orderInTransitEvent);
                break;
            }
            case constants_1.UpdateOrderStatuses.DELIVERED: {
                const orderDeliveredEvent = new order_delivered_event_1.OrderDeliveredEvent();
                orderDeliveredEvent.id = order.order_id;
                orderDeliveredEvent.receiver_email = receiver.email;
                orderDeliveredEvent.receiver_name = receiver.full_name;
                orderDeliveredEvent.delivery_date =
                    activity.estimated_delivery_date?.toDateString();
                this.eventEmitter.emit('order.updated.delivered', orderDeliveredEvent);
                break;
            }
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(reciever_schema_1.Receiver.name)),
    __param(2, (0, mongoose_1.InjectModel)(order_activities_schema_1.OrderActivity.name)),
    __param(3, (0, mongoose_1.InjectModel)(sender_schema_1.Sender.name)),
    __param(4, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Connection,
        event_emitter_1.EventEmitter2])
], OrdersService);
//# sourceMappingURL=orders.service.js.map