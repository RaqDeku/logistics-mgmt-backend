import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: 'The email address of the admin',
    example: 'admin@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the admin account',
    example: 'securepassword123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The first name of the admin',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'The last name of the admin',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  last_name: string;
}
