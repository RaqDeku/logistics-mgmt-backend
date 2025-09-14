import { UpdateOrderStatuses } from '../constants';
export declare class UpdateOrderStatus {
    status: UpdateOrderStatuses;
    reason?: string;
    notes?: string;
    duration?: number;
    location?: string;
    estimated_delivery_date?: Date;
}
