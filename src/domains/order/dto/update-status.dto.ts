import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderStatus, UpdateOrderStatuses } from '../constants';

const allStatuses = { ...UpdateOrderStatuses };

export class UpdateOrderStatus {
  @ApiProperty({
    description: 'The new status of the order.',
    enum: allStatuses,
    // example: UpdateOrderStatuses.IN_TRANSIT,
  })
  @IsEnum(allStatuses, {
    message: `Status must be one of the following: ${Object.values(
      allStatuses,
    ).join(', ')}`,
  })
  status: UpdateOrderStatuses;

  @ApiProperty({
    description:
      'A reason for the status update, especially for "On Hold" status.',
    example: 'Customer not available at the location.',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    description:
      'Additional notes about the activity, e.g., delivery instructions or observations.',
    example: 'Package left with the receptionist as requested.',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description:
      'The duration for which the status is applicable, e.g., for "On Hold" status in hours.',
    example: 48,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  duration?: number;
}
