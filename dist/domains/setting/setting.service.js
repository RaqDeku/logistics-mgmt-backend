"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const company_profile_schema_1 = require("./schema/company-profile.schema");
const mongoose_2 = require("mongoose");
const contact_team_event_1 = require("../../events/contact.team.event");
const event_emitter_1 = require("@nestjs/event-emitter");
let SettingsService = class SettingsService {
    companyProfileModel;
    eventEmitter;
    constructor(companyProfileModel, eventEmitter) {
        this.companyProfileModel = companyProfileModel;
        this.eventEmitter = eventEmitter;
    }
    async createCompanyProfile(companyProfileDto, admin) {
        const existingProfile = await this.companyProfileModel.findOne().exec();
        if (existingProfile) {
            throw new common_1.BadRequestException('Company profile already exists, update it instead');
        }
        try {
            const companyProfile = new this.companyProfileModel({
                ...companyProfileDto,
                updatedBy: admin.id,
            });
            const savedCompany = await companyProfile.save();
            return savedCompany.id;
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Something went wrong');
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
    async updateCompanyProfile(id, companyProfileDto, admin) {
        const companyProfile = await this.companyProfileModel.findById(id).exec();
        if (!companyProfile) {
            throw new common_1.BadRequestException('Company profile not found');
        }
        try {
            companyProfile.set({
                ...companyProfileDto,
                updatedBy: admin.id,
            });
            await companyProfile.save();
            return;
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Something went wrong');
        }
    }
    async contactTeam(contactDto) {
        const company = await this.companyProfileModel
            .findOne()
            .select('email')
            .exec();
        const contactTeamEvent = new contact_team_event_1.ContactTeamEvent();
        contactTeamEvent.name = contactDto.name;
        contactTeamEvent.message = contactDto.message;
        contactTeamEvent.email = contactDto.email;
        contactTeamEvent.team_email = company.email;
        this.eventEmitter.emit('contact.team', contactTeamEvent);
        return 'Message well received';
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(company_profile_schema_1.CompanyProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        event_emitter_1.EventEmitter2])
], SettingsService);
//# sourceMappingURL=setting.service.js.map