import { OrdersService } from './orders.service';
import { CreateOrdersDto } from './dto/create-order.dto';
import { UpdateOrderStatus } from './dto/update-status.dto';
import { OrderAnalyticsService } from './analytics.service';
import { ResponsePayload } from '../types';
import { ReceiptService } from './receipt.service';
import express from 'express';
export declare class OrdersController {
    private readonly orderService;
    private readonly analyticsService;
    private readonly receiptService;
    constructor(orderService: OrdersService, analyticsService: OrderAnalyticsService, receiptService: ReceiptService);
    create(createOrdersDto: CreateOrdersDto, req: Request): Promise<ResponsePayload>;
    findAll(): Promise<ResponsePayload>;
    analytics(): Promise<ResponsePayload>;
    generateReceipt(order_id: string, res: express.Response): Promise<ResponsePayload>;
    findOrder(order_id: string): Promise<ResponsePayload>;
    track(order_id: string): Promise<ResponsePayload>;
    update(order_id: string): Promise<void>;
    updateStatus(order_id: string, updateOrderStatus: UpdateOrderStatus, req: Request): Promise<ResponsePayload>;
    delete(order_id: string): Promise<ResponsePayload>;
}
