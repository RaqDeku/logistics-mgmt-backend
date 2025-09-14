import { Model } from 'mongoose';
import { OrderActivityDocument } from './schema/order.activities.schema';
import { OrderDocument } from './schema/order.schema';
export declare class OrderAnalyticsService {
    private readonly orderModel;
    private readonly orderActivityModel;
    constructor(orderModel: Model<OrderDocument>, orderActivityModel: Model<OrderActivityDocument>);
    analytics(): Promise<{
        totalShipments: any;
        inTransit: number;
        onHold: number;
        delivered: number;
        processing: number;
        avgDeliveryTime: any;
        deliverySuccessRate: any;
        revenueOverview: {
            totalRevenue: any;
            averagePerShipment: any;
        };
        monthlyPerformance: any[];
        recentActivities: any[];
        statusDistribution: {
            inTransit: {
                count: number;
                percentage: number;
            };
            onHold: {
                count: number;
                percentage: number;
            };
            delivered: {
                count: number;
                percentage: number;
            };
            processing: {
                count: number;
                percentage: number;
            };
        };
    }>;
}
