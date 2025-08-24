import { Module } from '@nestjs/common';
import { SettingsController } from './setting.controller';
import { SettingsService } from './setting.service';

@Module({
  imports: [],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingModule {}
