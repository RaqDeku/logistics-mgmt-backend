import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CompanyProfile,
  CompanyProfileDocument,
} from './schema/company-profile.schema';
import { Model } from 'mongoose';
import { CompanyProfileDto } from './dto/company-profile.dto';

interface AdminPayload {
  id: string;
  email: string;
}
@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(CompanyProfile.name)
    private companyProfileModel: Model<CompanyProfileDocument>,
  ) {}

  async createCompanyProfile(
    companyProfileDto: CompanyProfileDto,
    admin: AdminPayload,
  ) {
    const existingProfile = await this.companyProfileModel.findOne().exec();
    if (existingProfile) {
      throw new BadRequestException(
        'Company profile already exists, update it instead',
      );
    }

    try {
      const companyProfile = new this.companyProfileModel({
        ...companyProfileDto,
        updatedBy: admin.id,
      });

      const savedCompany = await companyProfile.save();

      return savedCompany.id;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getCompanyProfile() {
    return await this.companyProfileModel.findOne().exec();
  }

  async updateCompanyProfile(
    id: string,
    companyProfileDto: CompanyProfileDto,
    admin: AdminPayload,
  ) {
    const companyProfile = await this.companyProfileModel.findById(id).exec();
    if (!companyProfile) {
      throw new BadRequestException('Company profile not found');
    }

    try {
      companyProfile.set({
        ...companyProfileDto,
        updatedBy: admin.id,
      });

      await companyProfile.save();

      return;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
