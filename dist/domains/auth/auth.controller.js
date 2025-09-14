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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const verify_token_dto_1 = require("./dto/verify-token.dto");
const express_1 = __importDefault(require("express"));
const types_1 = require("./types");
const swagger_1 = require("@nestjs/swagger");
const login_admin_dto_1 = require("./dto/login-admin.dto");
const auth_guard_1 = require("./auth.guard");
const types_2 = require("../types");
const edit_admin_dto_1 = require("./dto/edit-admin.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async create(createAdminDto, res) {
        const { token, cookie, user } = await this.authService.createAdmin(createAdminDto);
        return { token, user };
    }
    async login(loginAdminDto, res) {
        const { token, cookie, user } = await this.authService.loginAdmin(loginAdminDto);
        return { token, user };
    }
    async resetPasswordToken(email) {
        const res = await this.authService.resetPasswordToken(email);
        return {
            message: res,
        };
    }
    async verifyPasswordResetToken(verifyTokenDto) {
        const res = await this.authService.verifyPasswordResetToken(verifyTokenDto);
        return {
            message: res,
        };
    }
    async resetPassword(resetPasswordDto) {
        const res = await this.authService.resetPassword(resetPasswordDto);
        return {
            message: res,
        };
    }
    async logout(res) {
        res.clearCookie('_session');
        return {
            message: 'Logged out successfully',
        };
    }
    async editProfile(id, updateData) {
        const res = await this.authService.editProfile(id, updateData);
        return {
            message: res,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Post)('/register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new admin' }),
    (0, swagger_1.ApiBody)({ type: create_admin_dto_1.CreateAdminDto, description: 'Admin registration details' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'The admin has been successfully registered',
        type: types_1.AuthenticatedAdmin,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "create", null);
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Post)('/login'),
    (0, swagger_1.ApiOperation)({ summary: 'Logs in an admin' }),
    (0, swagger_1.ApiBody)({ type: login_admin_dto_1.LoginAdminDto, description: 'Admin login details' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'The admin has been successfully logged in',
        type: types_1.AuthenticatedAdmin,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_admin_dto_1.LoginAdminDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Get)('/reset-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Send password reset token to admin email' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Email sent!',
        type: types_2.ResponsePayload,
    }),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPasswordToken", null);
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Post)('/verify-reset-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify password reset token sent to admin email' }),
    (0, swagger_1.ApiBody)({ type: verify_token_dto_1.VerifyTokenDto, description: 'verify token details' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Verified',
        type: types_2.ResponsePayload,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_token_dto_1.VerifyTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyPasswordResetToken", null);
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Post)('/reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset admin password after token verification' }),
    (0, swagger_1.ApiBody)({ type: reset_password_dto_1.ResetPasswordDto, description: 'Reset Password details' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        type: types_2.ResponsePayload,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Delete)('/logout'),
    (0, swagger_1.ApiOperation)({ summary: 'Logs out the admin' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        type: types_2.ResponsePayload,
    }),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Patch)('/edit-profile/:id'),
    (0, swagger_1.ApiBearerAuth)('Bearer'),
    (0, swagger_1.ApiOperation)({ summary: 'Edit admin profile details' }),
    (0, swagger_1.ApiBody)({ type: edit_admin_dto_1.EditAdminDto, description: 'Admin profile edit details' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Success',
        type: types_2.ResponsePayload,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, edit_admin_dto_1.EditAdminDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "editProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('admins'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map