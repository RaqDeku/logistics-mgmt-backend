import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Receiver } from './reciever.schema';
import { OrderActivity } from './order.activities.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  item_type: string;

  @Prop({ required: true })
  item_description: string;

  @Prop({ required: true })
  net_weight: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Receiver.name })
  receiver: Types.ObjectId;

  @Prop({ required: true, type: Date })
  estimated_delivery_date: Date;

  @Prop({ required: true, type: Number })
  revenue: number;

  @Prop({ unique: true, index: true })
  order_id: string;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: OrderActivity.name }],
  })
  order_activities: Types.ObjectId[];
}

export const orderSchema = SchemaFactory.createForClass(Order);

orderSchema.pre('save', async function (next) {
  const order = this as OrderDocument;
  if (!this.isNew) return next();

  try {
    order.order_id = createOrderId();
    next();
  } catch (error) {
    next(error);
  }
});

function createOrderId() {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
