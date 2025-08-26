import { OrderDetails } from './types';

export class OrderDeliveredEvent extends OrderDetails {
  delivery_date?: string;
}
