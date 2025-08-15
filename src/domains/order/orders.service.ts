import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model, Types } from "mongoose";
import { Order, OrderDocument } from "./schema/order.schema";
import { Receiver, ReceiverDocument } from "./schema/reciever.schema";
import { CreateOrdersDto } from "./dto/create-order.dto";
import { OrderCreatedEvent } from "src/events/order-created.event";

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) 
        private readonly orderModel: Model<OrderDocument>,
        @InjectModel(Receiver.name)
        private readonly receiverModel: Model<ReceiverDocument>,
        @InjectConnection()
        private readonly connection: Connection,
        private eventEmitter: EventEmitter2
    ) {}

    async createOrders(createOrderDto: CreateOrdersDto) {
        const {items_info, receiver_info } = createOrderDto
        const session = await this.connection.startSession();

        try {
            await session.withTransaction(async () => {
                // save owner of order(s) first
                const receiver = new this.receiverModel({ ...receiver_info, orders: [] })
                await receiver.save({ session })

                // save order(s) with owner id
                const createdOrders: OrderDocument[] = [];
                for(const item of items_info) {
                    const order = new this.orderModel({ 
                        ...item,
                        estimated_delivery_date: new Date(item.estimated_delivery_date),
                        reciever_id: receiver.id 
                    })
                    const savedOrder = await order.save({ session })
        
                    createdOrders.push(savedOrder)
                }

                // update owner orders with saved orders
                receiver.orders = createdOrders.map((order) => order.id);
                await receiver.save({ session })

                createdOrders.forEach(order => {
                    const orderEvent = new OrderCreatedEvent()
                    orderEvent.id = order.order_id;
                    orderEvent.type = order.item_type;
                    orderEvent.estimated_delivery_date = order.estimated_delivery_date.toDateString();
                    orderEvent.status = order.status;
                    orderEvent.net_weight = order.net_weight;
                    orderEvent.receiver_email = receiver.email;
                    orderEvent.receiver_name = receiver.full_name;
        
                    this.eventEmitter.emit('order.created', orderEvent)
                });
            });

            return "Order created successfully"
        } catch (error) {
            throw new InternalServerErrorException("Something went wrong")
        } finally {
            session.endSession()
        }
    }
}