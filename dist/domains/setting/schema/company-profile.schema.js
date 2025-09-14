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
exports.CompanyProfileSchema = exports.CompanyProfile = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const company_profile_dto_1 = require("../dto/company-profile.dto");
const types_1 = require("../../auth/types");
let CompanyProfile = class CompanyProfile {
    company_name;
    email;
    phone_number;
    tax_id;
    address;
    website;
    currency;
    time_zone;
    updatedBy;
};
exports.CompanyProfile = CompanyProfile;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CompanyProfile.prototype, "company_name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CompanyProfile.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CompanyProfile.prototype, "phone_number", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CompanyProfile.prototype, "tax_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Object }),
    __metadata("design:type", company_profile_dto_1.Address)
], CompanyProfile.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], CompanyProfile.prototype, "website", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CompanyProfile.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CompanyProfile.prototype, "time_zone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: types_1.Admin.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CompanyProfile.prototype, "updatedBy", void 0);
exports.CompanyProfile = CompanyProfile = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CompanyProfile);
exports.CompanyProfileSchema = mongoose_1.SchemaFactory.createForClass(CompanyProfile);
//# sourceMappingURL=company-profile.schema.js.map