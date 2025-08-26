import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Admin } from '../../auth/schema/admin.schema';
import { OrderStatus, UpdateOrderStatuses } from '../constants';

export type OrderActivityDocument = HydratedDocument<OrderActivity>;

@Schema({ timestamps: true })
export class OrderActivity {
  @Prop({ required: true, index: true })
  order_id: string;

  @Prop({
    required: true,
    enum: [
      ...Object.values(OrderStatus),
      ...Object.values(UpdateOrderStatuses),
    ],
    index: true,
  })
  status: string;

  @Prop({ required: false })
  reason?: string;

  @Prop({ required: false })
  notes?: string;

  @Prop({ required: false })
  duration?: number;

  @Prop({ required: false })
  estimated_delivery_date: Date;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: Admin.name })
  admin: Types.ObjectId;
}

export const orderActivitySchema = SchemaFactory.createForClass(OrderActivity);
