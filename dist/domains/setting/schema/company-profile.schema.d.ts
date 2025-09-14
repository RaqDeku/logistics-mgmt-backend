import { HydratedDocument, Types } from 'mongoose';
import { Address } from '../dto/company-profile.dto';
export type CompanyProfileDocument = HydratedDocument<CompanyProfile>;
export declare class CompanyProfile {
    company_name: string;
    email: string;
    phone_number: string;
    tax_id: string;
    address: Address;
    website?: string;
    currency: string;
    time_zone: string;
    updatedBy: Types.ObjectId;
}
export declare const CompanyProfileSchema: import("mongoose").Schema<CompanyProfile, import("mongoose").Model<CompanyProfile, any, any, any, import("mongoose").Document<unknown, any, CompanyProfile, any, {}> & CompanyProfile & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CompanyProfile, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<CompanyProfile>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<CompanyProfile> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
