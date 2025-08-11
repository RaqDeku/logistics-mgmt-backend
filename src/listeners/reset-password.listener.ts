import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class ResetPasswordListener {
    constructor() {}

    @OnEvent('')
    handleResetPassword(){}
}