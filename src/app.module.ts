import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import keys from './config/keys';
import { AuthModule } from './domains/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderModule } from './domains/order/order.module';
import { EmailService } from './services/emails/email.service';
import { EmailModule } from './services/emails/email.module';

@Module({
  imports: [
    MongooseModule.forRoot(keys.mongoURI),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      global: true,
    }), 
    AuthModule,
    OrderModule,
    EmailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
