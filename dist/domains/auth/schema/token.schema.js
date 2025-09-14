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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetTokenSchema = exports.PasswordResetToken = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../constants");
let PasswordResetToken = class PasswordResetToken {
    email;
    token;
    expiresAt;
    status;
};
exports.PasswordResetToken = PasswordResetToken;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PasswordResetToken.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PasswordResetToken.prototype, "token", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], PasswordResetToken.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PasswordResetToken.prototype, "status", void 0);
exports.PasswordResetToken = PasswordResetToken = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PasswordResetToken);
exports.PasswordResetTokenSchema = mongoose_1.SchemaFactory.createForClass(PasswordResetToken);
exports.PasswordResetTokenSchema.pre('save', async function (next) {
    const token = this;
    try {
        if (this.isModified('token')) {
            const salt = await bcrypt_1.default.genSalt(10);
            token.token = await bcrypt_1.default.hash(token.token, salt);
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.PasswordResetTokenSchema.methods.isTokenValid = async function (token) {
    if (new Date(this.expiresAt) < new Date(Date.now())) {
        return false;
    }
    if ([constants_1.resetTokenStatus.VERIFIED, constants_1.resetTokenStatus.USED].includes(this.status)) {
        return false;
    }
    return bcrypt_1.default.compare(token, this.token);
};
//# sourceMappingURL=token.schema.js.map