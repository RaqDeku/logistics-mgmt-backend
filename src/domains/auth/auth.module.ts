import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Admin, AdminSchema } from "./schema/admin.schema";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Admin.name , schema: AdminSchema}]),
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule{}