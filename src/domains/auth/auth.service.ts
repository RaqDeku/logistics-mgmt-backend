import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Admin, AdminDocument } from "./schema/admin.schema";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { JwtService } from "@nestjs/jwt";
import { createHmac, randomBytes } from "crypto";
import { jwtConstants } from "./constants";
import { LoginAdminDto } from "./dto/login-admin.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Admin.name) 
        private adminModel: Model<AdminDocument>,
        private eventEmitter: EventEmitter2,
        private jwtService: JwtService
    ) {}

    async createAdmin(creds: CreateAdminDto) {
        const adminExist = await this.checkAdminExists(creds.email);
        if (adminExist) {
            throw new BadRequestException("Email exist");
        }

        const newAdmin = new this.adminModel(creds)
        const savedAdmin = await newAdmin.save()

        const payload = {
            id: savedAdmin.id,
            email: savedAdmin.id,
        }

        return {
            token: await this.jwtService.signAsync(payload),
            cookie: await this.generateCookie(savedAdmin.email),
            user: {
                name: savedAdmin.full_name,
                email: savedAdmin.email
            }
        }
    }

    async loginAdmin(creds: LoginAdminDto) {
        const admin = await this.adminModel.findOne({ email: creds.email });
        if (!admin) {
            throw new BadRequestException("Invalid credentials");
        }

        const match = await admin.comparePassword(creds.password)
        if(!match) {
            throw new BadRequestException("Invalid credentials");
        }

        const payload = {
            id: admin.id,
            email: admin.id,
        }

        return {
            token: await this.jwtService.signAsync(payload),
            cookie: await this.generateCookie(admin.email),
            user: {
                name: admin.full_name,
                email: admin.email
            }
        }
    }
    

    private async checkAdminExists(email: string): Promise<boolean> {
        const admin = await this.adminModel.findOne({ email }).exec()
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
}