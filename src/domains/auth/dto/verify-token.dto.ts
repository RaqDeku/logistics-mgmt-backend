import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class VerifyTokenDto {
  @ApiProperty({
    description: 'The email address of the admin',
    example: 'admin@example.com',
  })
  @IsEmail()
  email: string;
  
  @ApiProperty({
    description: 'The password reset token from email',
    example: '134568',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  token: string;
}