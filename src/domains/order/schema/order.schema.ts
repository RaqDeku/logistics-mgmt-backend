import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Receiver, receiverSchema } from "./reciever.schema";
import { ReceiverInformation } from "../types";
import { orderStatus } from "../constants";

export type OrderDocument = HydratedDocument<Order> & {}

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true })
    item_type: string

    @Prop({ required: true })
    item_description: string

    @Prop({ required: true })
    net_weight: string

    @Prop({ required: true, type: Types.ObjectId, ref: Receiver.name })
    reciever_id: Types.ObjectId

    @Prop({ required: true, type: Date })
    estimated_delivery_date: Date

    @Prop({ required: true, default: orderStatus.PROCESSING })
    status: string

    @Prop({ unique: true, index: true })
    order_id: string
}

export const orderSchema = SchemaFactory.createForClass(Order)

orderSchema.pre("save", async function(next) {
    const order = this as OrderDocument;

    try {
        if(!order.isModified('order_id')) next()
        order.order_id = createOrderId()

        next()
    } catch (error) {
        next(error)
    }
})

function createOrderId() {
    return "12345"
}