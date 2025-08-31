import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty({
    description: 'The ID of the order associated with the notification.',
    example: 'ORD-1672531200000-abcdef123',
  })
  order_id: string;

  @ApiProperty({
    description: 'The email address of the recipient.',
    example: 'receiver@gmail.com',
  })
  recipient_email: string;

  @ApiProperty({
    description: 'The subject of the notification email.',
    example: 'Order Created Successfully!',
  })
  subject: string;

  @ApiProperty({
    description: 'The status of the notification (e.g., success, failed).',
    example: 'success',
  })
  status: string;

  @ApiProperty({
    description: 'The timestamp when the notification was sent.',
    example: '2025-01-01T00:00:00.000Z',
  })
  sent_at: Date;
}
