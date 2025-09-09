import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ContactDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({
    example: 'Joe Doe',
  })
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'joedoe@email.com',
  })
  email: string;

  @IsString()
  @MinLength(12)
  @IsNotEmpty()
  @ApiProperty({
    example: 'Do you offer ....',
  })
  message: string;
}
