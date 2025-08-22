import { ApiProperty } from '@nestjs/swagger';
import {
  ItemInformation,
  ReceiverInformation,
  SenderInformation,
} from '../types';
import { IsArray, IsNotEmpty, IsObject } from 'class-validator';

export class CreateOrdersDto {
  @ApiProperty({
    description: 'The order details',
    type: [ItemInformation],
  })
  @IsNotEmpty()
  @IsArray()
  items_info: ItemInformation[];

  @ApiProperty({
    description: 'The receiver information',
    type: ReceiverInformation,
  })
  @IsObject()
  @IsNotEmpty()
  receiver_info: ReceiverInformation;

  @ApiProperty({
    description: 'The sender information',
    type: SenderInformation,
  })
  @IsObject()
  @IsNotEmpty()
  sender_info: SenderInformation;
}
