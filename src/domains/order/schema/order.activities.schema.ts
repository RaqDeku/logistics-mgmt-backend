import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Admin } from 'src/domains/auth/schema/admin.schema';

export type OrderActivityDocument = HydratedDocument<OrderActivity>;

@Schema({ timestamps: true })
export class OrderActivity {
  @Prop({ required: true })
  order_id: Types.ObjectId;

  @Prop({ required: true })
  status: string;

  @Prop({ required: false })
  reason?: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: Admin.name })
  admin: Types.ObjectId;
}

export const orderActivitySchema = SchemaFactory.createForClass(OrderActivity);
