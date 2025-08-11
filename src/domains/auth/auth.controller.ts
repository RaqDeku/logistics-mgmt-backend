import { Body, Controller, Delete, Get, Post, Query, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import  { AuthAdminDto } from "./dto/admin.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyTokenDto } from "./dto/verify-token.dto";

@Controller('admins')
export class AuthController {
    constructor(private readonly authService:AuthService) {}

    @Post('/register')
    create(@Body() createAdminDto: AuthAdminDto) {}

    @Post('/login')
    login(@Body() createAdminDto: AuthAdminDto) {}

    @Get('/reset-token')
    resetPasswordToken(@Query('email') email:string) {}

    @Post('/verify-reset-token')
    verifyPasswordResetToken(@Body() verifyTokenDto: VerifyTokenDto) {}

    @Post('/reset-password')
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {}

    @Delete('/logout')
    logout() {}
}