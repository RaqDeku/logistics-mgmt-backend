import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Admin, AdminDocument } from "./schema/admin.schema";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AuthAdminDto } from "./dto/admin.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Admin.name) 
        private readonly adminModel: Model<AdminDocument>,
        private eventEmitter: EventEmitter2
    ) {}

    create(creds: AuthAdminDto): Promise<Admin> {
        const admin = new this.adminModel(creds)
        return admin.save()
    }
}