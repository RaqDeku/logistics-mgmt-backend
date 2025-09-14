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
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const setting_service_1 = require("./setting.service");
const swagger_1 = require("@nestjs/swagger");
const company_profile_dto_1 = require("./dto/company-profile.dto");
const types_1 = require("../types");
const types_2 = require("./types");
const company_dto_1 = require("./dto/company.dto");
const auth_guard_1 = require("../auth/auth.guard");
let SettingsController = class SettingsController {
    settingService;
    constructor(settingService) {
        this.settingService = settingService;
    }
    async createCompanyProfile(companyProfileDto, req) {
        const admin = req['user'];
        const res = await this.settingService.createCompanyProfile(companyProfileDto, admin);
        return {
            message: 'Company profile created successfully',
            data: { company_id: res },
        };
    }
    async getCompanyProfile() {
        const res = await this.settingService.getCompanyProfile();
        return {
            data: res,
        };
    }
    async updateCompanyProfile(id, CompanyProfileDto, req) {
        const admin = req['user'];
        await this.settingService.updateCompanyProfile(id, CompanyProfileDto, admin);
        return {
            message: 'Company profile updated successfully',
        };
    }
    async contactTeam(contactDto) {
        const res = await this.settingService.contactTeam(contactDto);
        return {
            message: res,
        };
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    (0, swagger_1.ApiOperation)({ summary: 'Create company profile' }),
    (0, swagger_1.ApiBody)({
        description: 'Create a new company profile',
        type: company_profile_dto_1.CompanyProfileDto,
        required: true,
    }),
    (0, swagger_1.ApiCreatedResponse)({
        type: types_1.ResponsePayload,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_profile_dto_1.CompanyProfileDto,
        Request]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "createCompanyProfile", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get company profile' }),
    (0, swagger_1.ApiOkResponse)({
        type: types_2.CompanyProfileResponseDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getCompanyProfile", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    (0, swagger_1.ApiOperation)({ summary: 'Edit company profile' }),
    (0, swagger_1.ApiBody)({
        description: 'Updates company profile',
        type: company_profile_dto_1.CompanyProfileDto,
        required: true,
    }),
    (0, swagger_1.ApiOkResponse)({
        type: types_1.ResponsePayload,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, company_profile_dto_1.CompanyProfileDto,
        Request]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateCompanyProfile", null);
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Post)('/contact-team'),
    (0, swagger_1.ApiOperation)({ summary: 'Contact team' }),
    (0, swagger_1.ApiBody)({
        description: 'Contact Oceangate Logistics Team',
        type: company_dto_1.ContactDto,
        required: true,
    }),
    (0, swagger_1.ApiOkResponse)({
        type: types_1.ResponsePayload,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_dto_1.ContactDto]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "contactTeam", null);
exports.SettingsController = SettingsController = __decorate([
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [setting_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=setting.controller.js.map