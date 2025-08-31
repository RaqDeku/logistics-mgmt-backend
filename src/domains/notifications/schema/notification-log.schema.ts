import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationActivityLogDocument =
  HydratedDocument<NotificationActivityLog>;

@Schema({ timestamps: true })
export class NotificationActivityLog {
  @Prop({ required: true })
  order_id: string;

  @Prop({ required: true })
  recipient_email: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  sent_at: Date;
}

export const NotificationActivityLogSchema = SchemaFactory.createForClass(
  NotificationActivityLog,
);
