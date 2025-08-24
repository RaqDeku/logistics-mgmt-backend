import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EditAdminDto {
  @ApiProperty({
    description: 'The first name of the admin',
    example: 'John',
    required: true,
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'The last name of the admin',
    example: 'Doe',
    required: true,
  })
  @IsString()
  last_name: string;
}
