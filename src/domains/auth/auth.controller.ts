import { Body, Controller, Delete, Get, Post, Query, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import  { CreateAdminDto } from "./dto/create-admin.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyTokenDto } from "./dto/verify-token.dto";
import express from "express";
import { AuthenticatedAdmin } from "./types";
import { ApiBody, ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { LoginAdminDto } from "./dto/login-admin.dto";

@Controller('admins')
export class AuthController {
    constructor(private readonly authService:AuthService) {}

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

    @Post('/login')
    @ApiOperation({ summary: 'Logs in an admin' })
    @ApiBody({ type: LoginAdminDto, description: 'Admin login details' })
    @ApiCreatedResponse({
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

    @Get('/reset-token')
    resetPasswordToken(@Query('email') email:string) {}

    @Post('/verify-reset-token')
    verifyPasswordResetToken(@Body() verifyTokenDto: VerifyTokenDto) {}

    @Post('/reset-password')
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {}

    @Delete('/logout')
    logout() {}
}