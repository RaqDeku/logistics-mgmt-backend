import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsString,
  MaxLength,
} from 'class-validator';

export class Address {
  @ApiProperty({
    description: "The receiver's city/town",
    example: 'Kumasi',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: "The receiver's state",
    example: 'Ashanti region',
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    description: "The receiver's country",
    example: 'Ghana',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    description: "The receiver's pick up location/street address",
    example: 'house no 8, knust avenue',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: "The receiver's zip code",
    example: '00233',
  })
  @IsNotEmpty()
  @IsString()
  zip_code: string;
}

export class ReceiverInformation {
  @ApiProperty({
    description: "The receiver's full name",
    example: 'Joe Doe',
  })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({
    description: "The receiver's phone number",
    example: '+233 200000001',
  })
  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @ApiProperty({
    description: "The receiver's email",
    example: 'receiver@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The receiver's address",
    type: Address,
  })
  @IsNotEmpty()
  @IsObject()
  address: Address;
}

export class SenderInformation {
  @ApiProperty({
    description: "The sender's full name",
    example: 'John Andy',
  })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({
    description: "The sender's phone number",
    example: '+233 200000002',
  })
  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @ApiProperty({
    description: "The sender's email",
    example: 'sender@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The sender's address",
    type: Address,
  })
  @IsNotEmpty()
  @IsObject()
  address: Address;
}

export class ItemInformation {
  @ApiProperty({
    description: 'The item type',
    example: 'Gold Necklace',
  })
  @IsNotEmpty()
  @IsString()
  item_type: string;

  @ApiProperty({
    description: 'The item description',
    example: 'This is a 24k Gold Necklace',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  item_description: string;

  @ApiProperty({
    description: 'The item net weight',
    example: '50 g',
  })
  @IsNotEmpty()
  @IsString()
  net_weight: string;

  @ApiProperty({
    description: "The item's estimated delivery date",
    example: '2025-01-01',
  })
  @IsNotEmpty()
  @IsDateString({ strict: true })
  estimated_delivery_date: Date;

  @ApiProperty({
    description: "The item's estimated revenue",
    example: '100.00',
  })
  @IsNotEmpty()
  @IsNumber()
  revenue: number;

  @ApiProperty({
    description: "The item's declared value",
    example: '100.00',
  })
  @IsNotEmpty()
  @IsNumber()
  estimated_value: number;
}

export class OrderResponseDto {
  order_id: string;
  item_type: string;
  sender: string;
  receiver: string | null;
  estimated_delivery_date: Date;
  status: string | null;
}
