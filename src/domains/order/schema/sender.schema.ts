import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Address } from '../types';

export type SenderDocument = HydratedDocument<Sender>;

@Schema({ timestamps: true })
export class Sender {
  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  mobile_number: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, type: Address })
  address: Address;

  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: 'Order' }] })
  orders: Types.ObjectId[];
}

export const SenderSchema = SchemaFactory.createForClass(Sender);
