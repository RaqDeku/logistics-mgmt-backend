import { AuthService } from './auth.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import express from 'express';
import { AuthenticatedAdmin } from './types';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ResponsePayload } from '../types';
import { EditAdminDto } from './dto/edit-admin.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    create(createAdminDto: CreateAdminDto, res: express.Response): Promise<AuthenticatedAdmin>;
    login(loginAdminDto: LoginAdminDto, res: express.Response): Promise<{
        token: string;
        user: {
            id: any;
            name: string;
            email: string;
        };
    }>;
    resetPasswordToken(email: string): Promise<{
        message: string;
    }>;
    verifyPasswordResetToken(verifyTokenDto: VerifyTokenDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    logout(res: express.Response): Promise<{
        message: string;
    }>;
    editProfile(id: string, updateData: EditAdminDto): Promise<ResponsePayload>;
}
