import { OrderDetails } from './types';

export class OrderOnHoldEvent extends OrderDetails {
  reason?: string;
  notes?: string;
  duration?: number;
}
