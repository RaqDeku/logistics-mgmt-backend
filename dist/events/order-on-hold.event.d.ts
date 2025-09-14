import { OrderDetails } from './types';
export declare class OrderOnHoldEvent extends OrderDetails {
    reason?: string;
    notes?: string;
    duration?: number;
}
