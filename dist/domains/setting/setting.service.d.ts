import { CompanyProfile, CompanyProfileDocument } from './schema/company-profile.schema';
import { Model } from 'mongoose';
import { CompanyProfileDto } from './dto/company-profile.dto';
import { ContactDto } from './dto/company.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
interface AdminPayload {
    id: string;
    email: string;
}
export declare class SettingsService {
    private companyProfileModel;
    private eventEmitter;
    constructor(companyProfileModel: Model<CompanyProfileDocument>, eventEmitter: EventEmitter2);
    createCompanyProfile(companyProfileDto: CompanyProfileDto, admin: AdminPayload): Promise<any>;
    getCompanyProfile(): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, CompanyProfile, {}, {}> & CompanyProfile & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, CompanyProfile, {}, {}> & CompanyProfile & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    updateCompanyProfile(id: string, companyProfileDto: CompanyProfileDto, admin: AdminPayload): Promise<void>;
    contactTeam(contactDto: ContactDto): Promise<string>;
}
export {};
