import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import keys from './config/keys';
import { AuthModule } from './domains/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderModule } from './domains/order/order.module';
import { EmailModule } from './services/emails/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
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
