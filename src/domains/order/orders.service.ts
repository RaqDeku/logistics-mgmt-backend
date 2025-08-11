import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order, OrderDocument } from "./schema/order.schema";

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) 
        private readonly orderModel: Model<OrderDocument>,
        private eventEmitter: EventEmitter2
    ) {}
}