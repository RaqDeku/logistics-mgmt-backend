import { OrderDocument } from './schema/order.schema';
import { Model } from 'mongoose';
import { CompanyProfileDocument } from '../setting/schema/company-profile.schema';
export declare class ReceiptService {
    private readonly orderModel;
    private readonly companyProfile;
    constructor(orderModel: Model<OrderDocument>, companyProfile: Model<CompanyProfileDocument>);
    getReceipt(order_id: string): Promise<any>;
    private parseReceiptTemplate;
    private generateReceipt;
}
