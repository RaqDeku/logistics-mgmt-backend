import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './schema/admin.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtService } from '@nestjs/jwt';
import { createHmac, randomBytes } from 'crypto';
import { jwtConstants, resetTokenStatus } from './constants';
import { LoginAdminDto } from './dto/login-admin.dto';
import {
  PasswordResetToken,
  ResetPasswordTokenDocument,
} from './schema/token.schema';
import { ResetPasswordEvent } from 'src/events/reset-password.event';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EditAdminDto } from './dto/edit-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
    private eventEmitter: EventEmitter2,
    private jwtService: JwtService,
    @InjectModel(PasswordResetToken.name)
    private resetToken: Model<ResetPasswordTokenDocument>,
  ) {}

  async createAdmin(creds: CreateAdminDto) {
    const adminExist = await this.checkAdminExists(creds.email);
    if (adminExist) {
      throw new BadRequestException('Email exist');
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
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async loginAdmin(creds: LoginAdminDto) {
    const admin = await this.adminModel.findOne({ email: creds.email });
    if (!admin) {
      throw new BadRequestException('Invalid credentials');
    }

    const match = await admin.comparePassword(creds.password);
    if (!match) {
      throw new BadRequestException('Invalid credentials');
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
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async resetPasswordToken(email: string): Promise<string> {
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
      } else {
        resetToken = new this.resetToken({
          email,
          token,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
          status: 'requested',
        });
      }

      await resetToken.save();

      const resetPasswordEvent = new ResetPasswordEvent();
      resetPasswordEvent.email = email;
      resetPasswordEvent.token = token;

      this.eventEmitter.emit('reset.password', resetPasswordEvent);

      return 'Email Sent';
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async verifyPasswordResetToken(verifyTokenDto: VerifyTokenDto) {
    const resetToken = await this.resetToken
      .findOne({ email: verifyTokenDto.email })
      .exec();
    if (!resetToken) {
      throw new BadRequestException('Invalid token');
    }

    if (!(await resetToken.isTokenValid(verifyTokenDto.token))) {
      throw new BadRequestException('Invalid token');
    }

    try {
      resetToken.status = resetTokenStatus.VERIFIED;
      resetToken.expiresAt = new Date(Date.now());
      resetToken.save();

      return 'Verified';
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
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

    if (
      [resetTokenStatus.REQUESTED, resetTokenStatus.USED].includes(
        resetToken.status,
      )
    ) {
      return 'Password updated';
    }

    const admin = await this.adminModel
      .findOne({ email: resetPasswordDto.email })
      .exec();

    try {
      resetToken.status = resetTokenStatus.USED;
      admin.password = resetPasswordDto.password;

      await Promise.all([admin.save(), resetToken.save()]);

      return 'Password updated';
    } catch (error) {
      throw new InternalServerErrorException('something went wrong');
    }
  }

  async editProfile(id: string, updateDetails: EditAdminDto) {
    const admin = await this.adminModel.findById(id).exec();
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    try {
      admin.first_name = updateDetails.first_name;
      admin.last_name = updateDetails.last_name;
      admin.full_name = `${admin.first_name} ${admin.last_name}`;

      await admin.save();

      return 'Success';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('something went wrong');
    }
  }

  private async checkAdminExists(email: string): Promise<boolean> {
    const admin = await this.adminModel.findOne({ email }).exec();
    return !!admin;
  }

  private async generateCookie(value: string): Promise<string> {
    const nonce = randomBytes(16).toString('hex');
    const timestamp = Date.now().toString();

    const data = `${value}:${nonce}:${timestamp}`;

    // Generate HMAC-SHA256
    const hash = createHmac('sha256', jwtConstants.cookieSecret)
      .update(data)
      .digest('hex');

    return `${hash}.${nonce}.${timestamp}`;
  }

  validateCookie(value: string, cookie: string): boolean {
    const [hash, nonce, timestamp] = cookie.split('.');
    if (!hash || !nonce || !timestamp) {
      return false;
    }

    const currentTime = Date.now();
    if (currentTime - parseInt(timestamp, 10) > 24 * 60 * 60 * 1000) {
      return false;
    }

    const data = `${value}:${nonce}:${timestamp}`;

    const computedHash = createHmac('sha256', jwtConstants.cookieSecret)
      .update(data)
      .digest('hex');

    return computedHash === hash;
  }

  private generateOTPToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
