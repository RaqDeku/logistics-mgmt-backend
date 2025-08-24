import { Controller, Get, Post } from '@nestjs/common';
import { SettingsService } from './setting.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingService: SettingsService) {}

  @Post()
  async createCompanyProfile() {}

  @Get()
  async getCompanyProfile() {}
}
