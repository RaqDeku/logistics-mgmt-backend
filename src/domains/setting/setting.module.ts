import { Module } from '@nestjs/common';
import { SettingsController } from './setting.controller';
import { SettingsService } from './setting.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CompanyProfile,
  CompanyProfileSchema,
} from './schema/company-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompanyProfile.name, schema: CompanyProfileSchema },
    ]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingModule {}
