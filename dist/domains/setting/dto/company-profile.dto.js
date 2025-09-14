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
exports.CompanyProfileDto = exports.Address = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Address {
    city;
    state;
    country;
    address;
    zip_code;
}
exports.Address = Address;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The company's city/town",
        example: 'Kumasi',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The company's state",
        example: 'Ashanti region',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Address.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The company's country",
        example: 'Ghana',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Address.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The company's location/street address",
        example: 'house no 8, knust avenue',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Address.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The company's zip code",
        example: '00233',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Address.prototype, "zip_code", void 0);
class CompanyProfileDto {
    company_name;
    email;
    phone_number;
    tax_id;
    address;
    website;
    currency;
    time_zone;
}
exports.CompanyProfileDto = CompanyProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The company's name",
        example: 'Logistics Inc.',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompanyProfileDto.prototype, "company_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The company's email",
        example: 'logistics@gmail.com',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompanyProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The company's phone number",
        example: '+233-(0)-50-0000002',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompanyProfileDto.prototype, "phone_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The company's tax identification number",
        example: 'C0012345678',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompanyProfileDto.prototype, "tax_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The company's address",
        type: Address,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Address),
    __metadata("design:type", Address)
], CompanyProfileDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The company's website URL",
        example: 'https://logistics.com',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CompanyProfileDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The currency used by the company',
        example: 'GHS',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompanyProfileDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The time zone of the company',
        example: 'Africa/Accra',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompanyProfileDto.prototype, "time_zone", void 0);
//# sourceMappingURL=company-profile.dto.js.map