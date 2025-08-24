import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
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
  @ApiProperty({
    description: 'The unique ID of the order',
    example: 'ORD-1672531200000-abcdef123',
  })
  order_id: string;

  @ApiProperty({
    description: 'The type of item in the order',
    example: 'Electronics',
  })
  item_type: string;

  @ApiProperty({ description: "The sender's full name", example: 'John Andy' })
  sender: string;

  @ApiProperty({
    description: "The receiver's full name",
    example: 'Joe Doe',
    nullable: true,
  })
  receiver: string | null;

  @ApiProperty({
    description: 'The estimated delivery date of the order',
    example: '2025-01-01T00:00:00.000Z',
  })
  estimated_delivery_date: Date;

  @ApiProperty({
    description: 'The current status of the order',
    example: 'In Transit',
    nullable: true,
  })
  status: string | null;

  @ApiProperty({
    description: 'Indicates if the order is on hold',
    example: false,
  })
  is_on_hold: boolean;

  hold_reason?: string;

  hold_duration?: number;

  notes?: string;
}

export class CurrentHoldActivityDto {
  @ApiProperty({ example: 'ORD-1672531200000-abcdef123' })
  order_id: string;

  @ApiProperty({ example: 'On Hold' })
  status: string;

  @ApiProperty({
    required: false,
    example: 'Customer requested reschedule',
    description: 'Reason for the order being on hold.',
  })
  reason?: string;

  @ApiProperty({
    required: false,
    example: 'Call before arrival',
    description: 'Additional notes for the activity.',
  })
  notes?: string;

  @ApiProperty({
    required: false,
    example: 48,
    description: 'Duration of the hold in hours.',
  })
  duration?: number;

  @ApiProperty({ description: 'The date and time of this activity.' })
  date: Date;

  @ApiProperty({
    description: 'The admin who performed this activity.',
    example: 'Admin User',
  })
  placedBy: string;
}

export class GetOrderByIdResponseDto {
  @ApiProperty({ example: 'ORD-1672531200000-abcdef123' })
  order_id: string;

  @ApiProperty({ example: 'Electronics' })
  item_type: string;

  @ApiProperty({ example: 'A brand new laptop' })
  item_description: string;

  @ApiProperty({ example: '2.5kg' })
  net_weight: string;

  @ApiProperty({ type: ReceiverInformation })
  receiver: ReceiverInformation;

  @ApiProperty({ type: SenderInformation })
  sender: SenderInformation;

  @ApiProperty()
  estimated_delivery_date: Date;

  @ApiProperty({ example: 250.5 })
  revenue: number;

  @ApiProperty({ example: 1200 })
  estimated_value: number;

  @ApiProperty({
    example: 'In Transit',
    nullable: true,
    description: 'The latest status of the order.',
  })
  order_status: string | null;

  @ApiProperty({
    type: CurrentHoldActivityDto,
    required: false,
    nullable: true,
    description: 'Details of the hold, if the order is currently on hold.',
  })
  current_hold?: CurrentHoldActivityDto;
}

export class TrackOrderTimelineItemDto {
  @ApiProperty({
    description: 'The status of the order at this point in time.',
    example: 'In Transit',
  })
  status: string;

  @ApiProperty({
    description: 'The date of this activity.',
    example: '2025-01-01T10:00:00.000Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Reason for the status, if any.',
    example: 'Departed from facility',
    required: false,
  })
  reason?: string;

  @ApiProperty({
    description: 'Additional notes for the activity.',
    example: 'Package is on its way to the final destination.',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description:
      'Duration associated with the status (e.g., for hold in hours).',
    example: 24,
    required: false,
  })
  duration?: number;
}

export class TrackOrderResponseDto {
  @ApiProperty({
    description: 'The unique ID of the order.',
    example: 'ORD-1672531200000-abcdef123',
  })
  order_id: string;

  @ApiProperty({
    description: 'The type of item in the order.',
    example: 'Electronics',
  })
  item_type: string;

  @ApiProperty({
    description: 'The estimated delivery date of the order.',
    example: '2025-01-10T00:00:00.000Z',
  })
  estimated_delivery_date: Date;

  @ApiProperty({
    description: 'The current status of the order.',
    example: 'In Transit',
    nullable: true,
  })
  status: string | null;

  @ApiProperty({
    description: 'A chronological list of all activities for the order.',
    type: [TrackOrderTimelineItemDto],
  })
  timeline: TrackOrderTimelineItemDto[];
}
