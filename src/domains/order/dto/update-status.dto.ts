import { ApiProperty } from '@nestjs/swagger';
import { UpdateOrderStatuses } from '../constants';
import { IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';

export class UpdateOrderStatus {
  @ApiProperty({
    description: 'Order Status',
    example: 'In Transit, On Hold, Delivered',
  })
  @IsNotEmpty()
  @IsString()
  status: UpdateOrderStatuses;

  @ApiProperty({
    description:
      'Reason for the status change (required when status is "On Hold")',
    example:
      'Awaiting customer confirmation (required when status is "On Hold")',
    required: false,
  })
  @ValidateIf((o) => o.status === UpdateOrderStatuses.ON_HOLD)
  @IsNotEmpty({ message: 'Reason is required when status is On Hold' })
  @IsString()
  @MinLength(255, { message: 'Reason must be at least 255 characters long' })
  reason?: string;
}
