import { OrderDetails } from './types';

export class OrderInTransitEvent extends OrderDetails {
  notes?: string;
}
