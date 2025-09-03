import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, orderSchema } from './schema/order.schema';
import { Receiver, receiverSchema } from './schema/reciever.schema';
import {
  OrderActivity,
  orderActivitySchema,
} from './schema/order.activities.schema';
import { OrderAnalyticsService } from './analytics.service';
import { Sender, SenderSchema } from './schema/sender.schema';
import { ReceiptService } from './receipt.service';
import {
  CompanyProfile,
  CompanyProfileSchema,
} from '../setting/schema/company-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: orderSchema },
      { name: Receiver.name, schema: receiverSchema },
      { name: OrderActivity.name, schema: orderActivitySchema },
      { name: Sender.name, schema: SenderSchema },
      { name: CompanyProfile.name, schema: CompanyProfileSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderAnalyticsService, ReceiptService],
})
export class OrderModule {}
