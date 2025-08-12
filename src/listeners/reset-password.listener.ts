import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { ResetPasswordEvent } from "src/events/reset-password.event";
import { EmailService } from "src/services/emails/email.service";

@Injectable()
export class ResetPasswordListener {
    constructor(private emailService: EmailService) {}

    @OnEvent('reset.password')
    handleResetPassword(payload: ResetPasswordEvent) {
        // to something
        this.emailService.sendEmail()
    }
}