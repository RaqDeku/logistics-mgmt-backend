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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const admin_schema_1 = require("./schema/admin.schema");
const event_emitter_1 = require("@nestjs/event-emitter");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const constants_1 = require("./constants");
const token_schema_1 = require("./schema/token.schema");
const reset_password_event_1 = require("../../events/reset-password.event");
let AuthService = class AuthService {
    adminModel;
    eventEmitter;
    jwtService;
    resetToken;
    constructor(adminModel, eventEmitter, jwtService, resetToken) {
        this.adminModel = adminModel;
        this.eventEmitter = eventEmitter;
        this.jwtService = jwtService;
        this.resetToken = resetToken;
    }
    async createAdmin(creds) {
        const adminExist = await this.checkAdminExists(creds.email);
        if (adminExist) {
            throw new common_1.BadRequestException('Email exist');
        }
        try {
            const newAdmin = new this.adminModel(creds);
            newAdmin.full_name = `${newAdmin.first_name} ${newAdmin.last_name}`;
            const savedAdmin = await newAdmin.save();
            const payload = {
                id: savedAdmin.id,
                email: savedAdmin.id,
            };
            return {
                token: await this.jwtService.signAsync(payload),
                cookie: await this.generateCookie(savedAdmin.email),
                user: {
                    id: savedAdmin.id,
                    name: savedAdmin.full_name,
                    email: savedAdmin.email,
                },
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Something went wrong');
        }
    }
    async loginAdmin(creds) {
        const admin = await this.adminModel.findOne({ email: creds.email });
        if (!admin) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        const match = await admin.comparePassword(creds.password);
        if (!match) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        try {
            const payload = { id: admin.id, email: admin.id };
            return {
                token: await this.jwtService.signAsync(payload),
                cookie: await this.generateCookie(admin.email),
                user: {
                    id: admin.id,
                    name: admin.full_name,
                    email: admin.email,
                },
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Something went wrong');
        }
    }
    async resetPasswordToken(email) {
        const adminExist = await this.checkAdminExists(email);
        if (!adminExist) {
            return 'Email sent!';
        }
        try {
            const token = this.generateOTPToken();
            let resetToken = await this.resetToken.findOne({ email }).exec();
            if (resetToken) {
                resetToken.token = token;
                resetToken.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
                resetToken.status = 'requested';
            }
            else {
                resetToken = new this.resetToken({
                    email,
                    token,
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
                    status: 'requested',
                });
            }
            await resetToken.save();
            const resetPasswordEvent = new reset_password_event_1.ResetPasswordEvent();
            resetPasswordEvent.email = email;
            resetPasswordEvent.token = token;
            this.eventEmitter.emit('reset.password', resetPasswordEvent);
            return 'Email Sent';
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Something went wrong');
        }
    }
    async verifyPasswordResetToken(verifyTokenDto) {
        const resetToken = await this.resetToken
            .findOne({ email: verifyTokenDto.email })
            .exec();
        if (!resetToken) {
            throw new common_1.BadRequestException('Invalid token');
        }
        if (!(await resetToken.isTokenValid(verifyTokenDto.token))) {
            throw new common_1.BadRequestException('Invalid token');
        }
        try {
            resetToken.status = constants_1.resetTokenStatus.VERIFIED;
            resetToken.expiresAt = new Date(Date.now());
            resetToken.save();
            return 'Verified';
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Something went wrong');
        }
    }
    async resetPassword(resetPasswordDto) {
        const adminExist = await this.checkAdminExists(resetPasswordDto.email);
        if (!adminExist) {
            return 'Password updated';
        }
        const resetToken = await this.resetToken
            .findOne({ email: resetPasswordDto.email })
            .exec();
        if (!resetToken) {
            return 'Password updated';
        }
        if ([constants_1.resetTokenStatus.REQUESTED, constants_1.resetTokenStatus.USED].includes(resetToken.status)) {
            return 'Password updated';
        }
        const admin = await this.adminModel
            .findOne({ email: resetPasswordDto.email })
            .exec();
        try {
            resetToken.status = constants_1.resetTokenStatus.USED;
            admin.password = resetPasswordDto.password;
            await Promise.all([admin.save(), resetToken.save()]);
            return 'Password updated';
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('something went wrong');
        }
    }
    async editProfile(id, updateDetails) {
        const admin = await this.adminModel.findById(id).exec();
        if (!admin) {
            throw new common_1.BadRequestException('Admin not found');
        }
        try {
            admin.first_name = updateDetails.first_name;
            admin.last_name = updateDetails.last_name;
            admin.full_name = `${admin.first_name} ${admin.last_name}`;
            await admin.save();
            return 'Profile updated successfully';
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('something went wrong');
        }
    }
    async checkAdminExists(email) {
        const admin = await this.adminModel.findOne({ email }).exec();
        return !!admin;
    }
    async generateCookie(value) {
        const nonce = (0, crypto_1.randomBytes)(16).toString('hex');
        const timestamp = Date.now().toString();
        const data = `${value}:${nonce}:${timestamp}`;
        const hash = (0, crypto_1.createHmac)('sha256', constants_1.jwtConstants.cookieSecret)
            .update(data)
            .digest('hex');
        return `${hash}.${nonce}.${timestamp}`;
    }
    validateCookie(value, cookie) {
        const [hash, nonce, timestamp] = cookie.split('.');
        if (!hash || !nonce || !timestamp) {
            return false;
        }
        const currentTime = Date.now();
        if (currentTime - parseInt(timestamp, 10) > 24 * 60 * 60 * 1000) {
            return false;
        }
        const data = `${value}:${nonce}:${timestamp}`;
        const computedHash = (0, crypto_1.createHmac)('sha256', constants_1.jwtConstants.cookieSecret)
            .update(data)
            .digest('hex');
        return computedHash === hash;
    }
    generateOTPToken() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __param(3, (0, mongoose_1.InjectModel)(token_schema_1.PasswordResetToken.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        event_emitter_1.EventEmitter2,
        jwt_1.JwtService,
        mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map