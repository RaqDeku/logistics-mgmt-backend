import { SettingsService } from './setting.service';
import { CompanyProfileDto } from './dto/company-profile.dto';
import { ContactDto } from './dto/company.dto';
export declare class SettingsController {
    private readonly settingService;
    constructor(settingService: SettingsService);
    createCompanyProfile(companyProfileDto: CompanyProfileDto, req: Request): Promise<{
        message: string;
        data: {
            company_id: any;
        };
    }>;
    getCompanyProfile(): Promise<{
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schema/company-profile.schema").CompanyProfile, {}, {}> & import("./schema/company-profile.schema").CompanyProfile & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schema/company-profile.schema").CompanyProfile, {}, {}> & import("./schema/company-profile.schema").CompanyProfile & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    updateCompanyProfile(id: string, CompanyProfileDto: CompanyProfileDto, req: Request): Promise<{
        message: string;
    }>;
    contactTeam(contactDto: ContactDto): Promise<{
        message: string;
    }>;
}
