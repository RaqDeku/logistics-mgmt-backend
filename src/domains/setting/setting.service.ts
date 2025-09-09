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
import { ContactDto } from './dto/company.dto';
import { ContactTeamEvent } from 'src/events/contact.team.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface AdminPayload {
  id: string;
  email: string;
}
@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(CompanyProfile.name)
    private companyProfileModel: Model<CompanyProfileDocument>,
    private eventEmitter: EventEmitter2,
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
    return await this.companyProfileModel
      .findOne()
      .populate({
        path: 'updatedBy',
        select: 'full_name',
      })
      .select('-__v -createdAt')
      .exec();
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

  async contactTeam(contactDto: ContactDto) {
    const company = await this.companyProfileModel
      .findOne()
      .select('email')
      .exec();

    const contactTeamEvent = new ContactTeamEvent();
    contactTeamEvent.name = contactDto.name;
    contactTeamEvent.message = contactDto.message;
    contactTeamEvent.email = contactDto.email;
    contactTeamEvent.team_email = company.email;

    this.eventEmitter.emit('contact.team', contactTeamEvent);

    return 'Message well received';
  }
}
