import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { Model } from 'mongoose';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import html_to_pdf from 'html-pdf-node';
import {
  CompanyProfile,
  CompanyProfileDocument,
} from '../setting/schema/company-profile.schema';

interface AdminPayload {
  id: string;
  email: string;
}
@Injectable()
export class ReceiptService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(CompanyProfile.name)
    private readonly companyProfile: Model<CompanyProfileDocument>,
  ) {}

  async getReceipt(order_id: string, admin: AdminPayload) {
    const order = await this.orderModel
      .findOne({ order_id, admin_id: admin.id })
      .select('-updatedAt -__v')
      .populate([
        { path: 'receiver', select: '-createdAt -updatedAt -orders -__v' },
        { path: 'sender', select: '-createdAt -updatedAt -orders -__v' },
      ])
      .lean()
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const companyProfile = await this.companyProfile
      .findOne()
      .select('-createdAt -updatedAt -__v')
      .lean()
      .exec();

    try {
      const html = await this.parseReceiptTemplate({
        ...order,
        ...companyProfile,
        receipt_date: new Date(Date.now()).toDateString(),
      });

      return await this.generateReceipt(html);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  private async parseReceiptTemplate(data: any): Promise<string> {
    const filePath = path.join(__dirname, '.', 'templates', 'receipt.hbs');
    const templateFile = fs.readFileSync(filePath, 'utf8');
    const template = Handlebars.compile(templateFile);

    return template(data);
  }

  private async generateReceipt(html: string) {
    const file = { content: html };
    const options = {
      format: 'A4',
      printBackground: true,
    };

    return await html_to_pdf.generatePdf(file, options);
  }
}
