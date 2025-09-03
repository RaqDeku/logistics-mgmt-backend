import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Address } from '../dto/company-profile.dto';
import { Admin } from 'src/domains/auth/types';

export type CompanyProfileDocument = HydratedDocument<CompanyProfile>;

@Schema({ timestamps: true })
export class CompanyProfile {
  @Prop({ required: true })
  company_name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone_number: string;

  @Prop({ required: true })
  tax_id: string;

  @Prop({ required: true, type: Object })
  address: Address;

  @Prop({ required: false })
  website?: string;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  time_zone: string;

  @Prop({ type: Types.ObjectId, ref: Admin.name, required: true })
  updatedBy: Types.ObjectId;
}

export const CompanyProfileSchema =
  SchemaFactory.createForClass(CompanyProfile);
