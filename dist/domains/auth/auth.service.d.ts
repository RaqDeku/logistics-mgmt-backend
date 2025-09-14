import { Model } from 'mongoose';
import { AdminDocument } from './schema/admin.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ResetPasswordTokenDocument } from './schema/token.schema';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EditAdminDto } from './dto/edit-admin.dto';
export declare class AuthService {
    private adminModel;
    private eventEmitter;
    private jwtService;
    private resetToken;
    constructor(adminModel: Model<AdminDocument>, eventEmitter: EventEmitter2, jwtService: JwtService, resetToken: Model<ResetPasswordTokenDocument>);
    createAdmin(creds: CreateAdminDto): Promise<{
        token: string;
        cookie: string;
        user: {
            id: any;
            name: string;
            email: string;
        };
    }>;
    loginAdmin(creds: LoginAdminDto): Promise<{
        token: string;
        cookie: string;
        user: {
            id: any;
            name: string;
            email: string;
        };
    }>;
    resetPasswordToken(email: string): Promise<string>;
    verifyPasswordResetToken(verifyTokenDto: VerifyTokenDto): Promise<string>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string>;
    editProfile(id: string, updateDetails: EditAdminDto): Promise<string>;
    private checkAdminExists;
    private generateCookie;
    validateCookie(value: string, cookie: string): boolean;
    private generateOTPToken;
}
