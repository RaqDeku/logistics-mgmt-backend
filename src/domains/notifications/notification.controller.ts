import { Controller, Get, Req } from '@nestjs/common';
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
  async getNotifications(@Req() req: Request): Promise<ResponsePayload> {
    const admin = req['user'];
    const res = await this.notificationService.getNotifications(admin);

    return {
      data: res,
    };
  }
}
