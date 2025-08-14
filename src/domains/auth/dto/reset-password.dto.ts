import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({
        description: 'The email address of the admin',
        example: 'admin@example.com',
    })
    @IsEmail()
    email: string
    
    @ApiProperty({
        description: 'The new password for the admin account',
        example: 'securepassword123',
        minLength: 6,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string
}