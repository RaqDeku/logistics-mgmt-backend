import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class Address {
  @ApiProperty({
    description: "The company's city/town",
    example: 'Kumasi',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: "The company's state",
    example: 'Ashanti region',
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    description: "The company's country",
    example: 'Ghana',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    description: "The company's location/street address",
    example: 'house no 8, knust avenue',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: "The company's zip code",
    example: '00233',
  })
  @IsNotEmpty()
  @IsString()
  zip_code: string;
}

export class CompanyProfileDto {
  @ApiProperty({
    description: "The company's name",
    example: 'Logistics Inc.',
  })
  @IsNotEmpty()
  @IsString()
  company_name: string;

  @ApiProperty({
    description: "The company's email",
    example: 'logistics@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: "The company's phone number",
    example: '+233-(0)-50-0000002',
  })
  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @ApiProperty({
    description: "The company's tax identification number",
    example: 'C0012345678',
  })
  @IsNotEmpty()
  @IsString()
  tax_id: string;

  @ApiProperty({
    description: "The company's address",
    type: Address,
  })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @ApiProperty({
    description: "The company's website URL",
    example: 'https://logistics.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  website: string;

  @ApiProperty({
    description: 'The currency used by the company',
    example: 'GHS',
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'The time zone of the company',
    example: 'Africa/Accra',
  })
  @IsNotEmpty()
  @IsString()
  time_zone: string;
}
