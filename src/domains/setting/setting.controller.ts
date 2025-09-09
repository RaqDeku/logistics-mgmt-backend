import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { SettingsService } from './setting.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { CompanyProfileDto } from './dto/company-profile.dto';
import { ResponsePayload } from '../types';
import { CompanyProfileResponseDto } from './types';
import { ContactDto } from './dto/company.dto';
import { Public } from '../auth/auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingService: SettingsService) {}

  @Post()
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create company profile' })
  @ApiBody({
    description: 'Create a new company profile',
    type: CompanyProfileDto,
    required: true,
  })
  @ApiCreatedResponse({
    type: ResponsePayload,
  })
  async createCompanyProfile(
    @Body() companyProfileDto: CompanyProfileDto,
    @Req() req: Request,
  ) {
    const admin = req['user'];

    const res = await this.settingService.createCompanyProfile(
      companyProfileDto,
      admin,
    );

    return {
      message: 'Company profile created successfully',
      data: { company_id: res },
    };
  }

  @Get()
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get company profile' })
  @ApiOkResponse({
    type: CompanyProfileResponseDto,
  })
  async getCompanyProfile() {
    const res = await this.settingService.getCompanyProfile();
    return {
      data: res,
    };
  }

  @Put(':id')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Edit company profile' })
  @ApiBody({
    description: 'Updates company profile',
    type: CompanyProfileDto,
    required: true,
  })
  @ApiOkResponse({
    type: ResponsePayload,
  })
  async updateCompanyProfile(
    @Param('id') id: string,
    @Body() CompanyProfileDto: CompanyProfileDto,
    @Req() req: Request,
  ) {
    const admin = req['user'];

    await this.settingService.updateCompanyProfile(
      id,
      CompanyProfileDto,
      admin,
    );

    return {
      message: 'Company profile updated successfully',
    };
  }

  @Public()
  @Post('/contact-team')
  @ApiOperation({ summary: 'Contact team' })
  @ApiBody({
    description: 'Contact Oceangate Logistics Team',
    type: ContactDto,
    required: true,
  })
  @ApiOkResponse({
    type: ResponsePayload,
  })
  async contactTeam(@Body() contactDto: ContactDto) {
    const res = await this.settingService.contactTeam(contactDto);
    return {
      message: res,
    };
  }
}
