import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ResetPasswordEvent } from '../../events/reset-password.event';
import * as nodemailer from 'nodemailer';
import { OrderCreatedEvent } from 'src/events/order-created.event';
import { OrderOnHoldEvent } from 'src/events/order-on-hold.event';
import { OrderInTransitEvent } from 'src/events/order-in-transit.event';
import { OrderDeliveredEvent } from 'src/events/order-delivered.event';

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

  @OnEvent('order.created', { async: true })
  async handleOrderCreatedEvent(event: OrderCreatedEvent) {
    const {
      receiver_email,
      id,
      type,
      estimated_delivery_date,
      status,
      net_weight,
      receiver_name,
    } = event;

    try {
      await this.transporter.sendMail({
        from: '"Logistics Management" <no-reply@your-app.com>',
        to: receiver_email,
        subject: 'Order Created Successfully!',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 20px;">
              <tr>
                <td align="center">
                  <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #007bff; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Logistics Management</h1>
                      </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                      <td style="padding: 30px;">
                        <h2 style="color: #333333; font-size: 20px; margin: 0 0 20px;">Order Created Successfully!</h2>
                        <p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                          Dear ${receiver_name},
                        </p>
                        <p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                          We’re pleased to inform you that your order has been successfully created. Below are the details of your order:
                        </p>
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 20px;">
                          <tr>
                            <td style="padding: 10px; background-color: #f9f9f9; font-size: 16px; font-weight: bold; color: #333333;">Order ID:</td>
                            <td style="padding: 10px; font-size: 16px; color: #555555;">${id}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px; background-color: #f9f9f9; font-size: 16px; font-weight: bold; color: #333333;">Item Type:</td>
                            <td style="padding: 10px; font-size: 16px; color: #555555;">${type}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px; background-color: #f9f9f9; font-size: 16px; font-weight: bold; color: #333333;">Net Weight:</td>
                            <td style="padding: 10px; font-size: 16px; color: #555555;">${net_weight}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px; background-color: #f9f9f9; font-size: 16px; font-weight: bold; color: #333333;">Estimated Delivery Date:</td>
                            <td style="padding: 10px; font-size: 16px; color: #555555;">${estimated_delivery_date}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px; background-color: #f9f9f9; font-size: 16px; font-weight: bold; color: #333333;">Status:</td>
                            <td style="padding: 10px; font-size: 16px; color: #555555;">${status}</td>
                          </tr>
                        </table>
                        <p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                          You will receive further updates as your order progresses. If you have any questions, feel free to contact our support team.
                        </p>
                        <p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 0;">
                          Thank you for choosing Logistics Management!
                        </p>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 14px; color: #777777;">
                        <p style="margin: 0 0 10px;">Logistics Management | 123 Business Ave, Kumasi, Ghana</p>
                        <p style="margin: 0;">
                          <a href="mailto:support@your-app.com" style="color: #007bff; text-decoration: none;">Contact Us</a> | 
                          <a href="https://your-app.com/unsubscribe" style="color: #007bff; text-decoration: none;">Unsubscribe</a>
                        </p>
                        <p style="margin: 10px 0 0;">&copy; 2025 Logistics Management. All rights reserved.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });
    } catch (error) {
      console.error('Error sending order creation email:', error);
    }
  }

  @OnEvent('order.updated.on-hold', { async: true })
  async handleOrderOnHoldEvent(event: OrderOnHoldEvent) {
    const { id, receiver_email, receiver_name, reason, duration, notes } =
      event;

    try {
      await this.transporter.sendMail({
        from: '"Logistics Management" <no-reply@your-app.com>',
        to: receiver_email,
        subject: `Your Shipment ${id} is On Hold`,
        html: `
        <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body>
          <p>Dear ${receiver_name}, </p>
          <p> Your shipment with tracking number ${id} has been placed on hold. </p>
          <p>Reason: ${reason} </p>
          <p>Expected Duration: ${duration} </p>
          <p>Addition Notes: ${notes} </p>

          <p>We will notify you once your shipment is released. </p>

          <p>Best regards, </p>
          <p>Oceanlink Team</p>
          </body>
          </body>
          </html>
        `,
      });
    } catch (error) {
      console.error('Error sending order on hold email:', error);
    }
  }

  @OnEvent('order.updated.in-transit', { async: true })
  async handleOrderInTransitEvent(event: OrderInTransitEvent) {
    const { id, receiver_email, receiver_name, notes } = event;

    try {
      await this.transporter.sendMail({
        from: '"Logistics Management" <no-reply@your-app.com>',
        to: receiver_email,
        subject: `Your Shipment ${id} is In Transit`,
        html: `
        <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body>
          <p>Dear ${receiver_name}, </p>
          <p> Your shipment with tracking number ${id} is in transit. </p>
          <p>Notes: ${notes} </p>
      
          <p>Best regards, </p>
          <p>Oceanlink Team</p>
          </body>
          </body>
          </html>
        `,
      });
    } catch (error) {
      console.error('Error sending order in transit email:', error);
    }
  }

  @OnEvent('order.updated.delivered', { async: true })
  async handleOrderDeliveredEvent(event: OrderDeliveredEvent) {
    const { id, receiver_email, receiver_name, delivery_date } = event;

    try {
      await this.transporter.sendMail({
        from: '"Logistics Management" <no-reply@your-app.com>',
        to: receiver_email,
        subject: `Your Shipment ${id} has been delivered`,
        html: `
        <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body>
          <p>Dear ${receiver_name}, </p>
          <p> Your shipment with tracking number ${id} has been delivered. </p>
          <p>Delivery Date: ${delivery_date} </p>
          <p>Received By: ${receiver_name} </p>

          <p>Thank you for choosing OceanLink. </p>

          <p>Best regards, </p>
          <p>Oceanlink Team</p>
          </body>
          </body>
          </html>
        `,
      });
    } catch (error) {
      console.error('Error sending order in transit email:', error);
    }
  }
}
