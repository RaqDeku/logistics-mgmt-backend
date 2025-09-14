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
exports.AuthenticatedAdmin = exports.Admin = void 0;
const swagger_1 = require("@nestjs/swagger");
class Admin {
    email;
    id;
    name;
}
exports.Admin = Admin;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The admin email',
        example: 'admin@example.com',
    }),
    __metadata("design:type", String)
], Admin.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The admin id',
        example: '68ac32339405bfdf991ef683',
    }),
    __metadata("design:type", String)
], Admin.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The admin full name',
        example: 'John Doe',
    }),
    __metadata("design:type", String)
], Admin.prototype, "name", void 0);
class AuthenticatedAdmin {
    token;
    user;
}
exports.AuthenticatedAdmin = AuthenticatedAdmin;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The authentication token for the admin',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], AuthenticatedAdmin.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The admin user details',
        type: Admin,
    }),
    __metadata("design:type", Admin)
], AuthenticatedAdmin.prototype, "user", void 0);
//# sourceMappingURL=types.js.map