import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, orderSchema } from "./schema/order.schema";
import { Receiver, receiverSchema } from "./schema/reciever.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Order.name, schema: orderSchema },
            { name: Receiver.name, schema: receiverSchema }
        ]),
    ],
    controllers: [OrdersController],
    providers: [OrdersService]
})
export class OrderModule {}