import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthAdminDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}