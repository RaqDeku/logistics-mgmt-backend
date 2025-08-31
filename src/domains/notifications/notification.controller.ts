import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ResponsePayload } from '../types';
import { NotificationResponseDto } from './types';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiOkResponse({
    description: 'A list of notification logs.',
    type: [NotificationResponseDto],
  })
  async getNotifications(): Promise<ResponsePayload> {
    const res = await this.notificationService.getNotifications();

    return {
      data: res,
    };
  }
}
