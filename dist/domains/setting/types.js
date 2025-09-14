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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyProfileResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const company_profile_dto_1 = require("./dto/company-profile.dto");
class CompanyProfileResponseDto extends company_profile_dto_1.CompanyProfileDto {
    _id;
    updatedAt;
    updatedBy;
}
exports.CompanyProfileResponseDto = CompanyProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The unique identifier of the company profile',
        example: '60c72b2f9b1d8c001f8e4a3a',
    }),
    __metadata("design:type", String)
], CompanyProfileResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The date and time the profile was last updated',
        example: '2023-01-02T12:00:00.000Z',
    }),
    __metadata("design:type", Date)
], CompanyProfileResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the admin who last updated the profile',
        example: '60c72b2f9b1d8c001f8e4a3b',
    }),
    __metadata("design:type", String)
], CompanyProfileResponseDto.prototype, "updatedBy", void 0);
//# sourceMappingURL=types.js.map