import { EventEmitter2 } from '@nestjs/event-emitter';
import { Connection, Model } from 'mongoose';
import { OrderDocument } from './schema/order.schema';
import { ReceiverDocument } from './schema/reciever.schema';
import { CreateOrdersDto } from './dto/create-order.dto';
import { UpdateOrderStatus } from './dto/update-status.dto';
import { OrderActivityDocument } from './schema/order.activities.schema';
import { GetOrderByIdResponseDto, OrderResponseDto, TrackOrderResponseDto } from './types';
import { SenderDocument } from './schema/sender.schema';
interface AdminPayload {
    id: string;
    email: string;
}
export declare class OrdersService {
    private readonly orderModel;
    private readonly receiverModel;
    private readonly orderActivityModel;
    private readonly senderModel;
    private readonly connection;
    private eventEmitter;
    constructor(orderModel: Model<OrderDocument>, receiverModel: Model<ReceiverDocument>, orderActivityModel: Model<OrderActivityDocument>, senderModel: Model<SenderDocument>, connection: Connection, eventEmitter: EventEmitter2);
    createOrders(createOrderDto: CreateOrdersDto, admin: AdminPayload): Promise<{
        order_id: string;
    }>;
    getAllOrders(): Promise<OrderResponseDto[]>;
    getOrderById(order_id: string): Promise<GetOrderByIdResponseDto>;
    updateOrderStatus(order_id: string, updateOrderStatus: UpdateOrderStatus, admin: AdminPayload): Promise<string>;
    trackOrder(order_id: string): Promise<TrackOrderResponseDto>;
    deleteOrder(order_id: string): Promise<string>;
    private emitOrderEvent;
}
export {};
