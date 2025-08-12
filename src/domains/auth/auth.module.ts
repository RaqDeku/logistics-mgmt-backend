import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Admin, AdminSchema } from "./schema/admin.schema";
import { ResetPasswordListener } from "src/listeners/reset-password.listener";
import { jwtConstants } from "./constants";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Admin.name , schema: AdminSchema}]),
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '10m' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule{}