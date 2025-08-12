import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, orderSchema } from "./schema/order.schema";
import { AuthService } from "../auth/auth.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Order.name, schema: orderSchema }]),
    ],
    controllers: [OrdersController],
    providers: [OrdersService]
})
export class OrderModule {}