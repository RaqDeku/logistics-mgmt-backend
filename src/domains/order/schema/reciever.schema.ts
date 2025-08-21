import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ReceiverAddress } from '../types';
import { Order } from './order.schema';

export type ReceiverDocument = HydratedDocument<Receiver>;

@Schema({ timestamps: true })
export class Receiver {
  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  mobile_number: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, type: ReceiverAddress })
  address: ReceiverAddress;

  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: 'Order' }] })
  orders: Types.ObjectId[];
}

export const receiverSchema = SchemaFactory.createForClass(Receiver);
