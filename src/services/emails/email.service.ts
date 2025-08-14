import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ResetPasswordEvent } from '../../events/reset-password.event';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      // secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  @OnEvent('reset.password', { async: true })
  async handleResetPasswordEvent(event: ResetPasswordEvent) {
    const { email, token } = event;
    
    try {
      await this.transporter.sendMail({
        from: '"Logistics Management" <no-reply@your-app.com>',
        to: email,
        subject: 'Password Reset Request',
        html: `
          <p>You requested a password reset for your account.</p>
          <p>Please use the following token: <strong>${token}</strong></p>
          
          <p>This link expires in 15 minutes.</p>
        `,
      });
      
    } catch (error) {
      console.error('Error sending password reset email:', error);
      // throw new Error('Failed to send password reset email');
    }
  }
}