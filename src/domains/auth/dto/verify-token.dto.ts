import { IsEmail, IsNotEmpty } from "class-validator";

export class VerifyTokenDto {
    @IsNotEmpty()
    token: string

    @IsEmail()
    email: string
}