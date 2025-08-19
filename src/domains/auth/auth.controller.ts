import { Body, Controller, Delete, Get, Post, Query, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import  { CreateAdminDto } from "./dto/create-admin.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyTokenDto } from "./dto/verify-token.dto";
import express from "express";
import { AuthenticatedAdmin } from "./types";
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { Public } from "./auth.guard";

@Controller('admins')
export class AuthController {
    constructor(private readonly authService:AuthService) {}

    @Public()
    @Post('/register')
    @ApiOperation({ summary: 'Register a new admin' })
    @ApiBody({ type: CreateAdminDto, description: 'Admin registration details' })
    @ApiCreatedResponse({
        description: 'The admin has been successfully registered',
        type: AuthenticatedAdmin,
    })
    async create(
        @Body() createAdminDto: CreateAdminDto, 
        @Res({ passthrough: true }) res: express.Response
    ): Promise<AuthenticatedAdmin> {
        const { token, cookie, user } = await this.authService.createAdmin(createAdminDto);

        res.cookie("_session", cookie, { 
            maxAge: 24 * 60 * 60 * 1000, 
            httpOnly: true,
            // secure: true 
        });

        return { token, user };
    }

    @Public()
    @Post('/login')
    @ApiOperation({ summary: 'Logs in an admin' })
    @ApiBody({ type: LoginAdminDto, description: 'Admin login details' })
    @ApiOkResponse({
        description: 'The admin has been successfully logged in',
        type: AuthenticatedAdmin,
    })
    async login(
        @Body() loginAdminDto: LoginAdminDto, 
        @Res({ passthrough: true }) res: express.Response
    ) {
        const { token, cookie, user } = await this.authService.loginAdmin(loginAdminDto);

        res.cookie("_session", cookie, { 
            maxAge: 24 * 60 * 60 * 1000, 
            httpOnly: true,
            // secure: true 
        });

        return { token, user };
    }

    @Public()
    @Get('/reset-token')
    @ApiOperation({ summary: 'Send password reset token to admin email' })
    @ApiOkResponse({
        description: 'Email sent!',
    })
    async resetPasswordToken(@Query('email') email:string) {
        return await this.authService.resetPasswordToken(email)
    }

    @Public()
    @Post('/verify-reset-token')
    @ApiOperation({ summary: 'Verify password reset token sent to admin email' })
    @ApiBody({ type: VerifyTokenDto, description: 'verify token details' })
    @ApiOkResponse({
        description: 'Verified',
    })
    async verifyPasswordResetToken(@Body() verifyTokenDto: VerifyTokenDto) {
        return await this.authService.verifyPasswordResetToken(verifyTokenDto)
    }

    @Public()
    @Post('/reset-password')
    @ApiOperation({ summary: 'Reset admin password after token verification' })
    @ApiBody({ type: ResetPasswordDto, description: 'Reset Password details' })
    @ApiOkResponse({
        description: 'Password updated',
    })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return await this.authService.resetPassword(resetPasswordDto)
    }

    @Public()
    @Delete('/logout')
    @ApiOperation({ summary: 'Logs out the admin' })
    @ApiOkResponse({
        description: 'Success',
    })
    async logout(@Res({ passthrough: true }) res: express.Response) {
        res.clearCookie("_session")

        return "Success"
    }
}