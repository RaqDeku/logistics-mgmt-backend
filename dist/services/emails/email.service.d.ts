import { EventEmitter2 } from '@nestjs/event-emitter';
import { ResetPasswordEvent } from '../../events/reset-password.event';
import { OrderCreatedEvent } from 'src/events/order-created.event';
import { OrderOnHoldEvent } from 'src/events/order-on-hold.event';
import { OrderInTransitEvent } from 'src/events/order-in-transit.event';
import { OrderDeliveredEvent } from 'src/events/order-delivered.event';
import { ContactTeamEvent } from 'src/events/contact.team.event';
export declare class EmailService {
    private eventEmitter;
    private transporter;
    constructor(eventEmitter: EventEmitter2);
    handleResetPasswordEvent(event: ResetPasswordEvent): Promise<void>;
    private emitNotificationEvent;
    handleOrderCreatedEvent(event: OrderCreatedEvent): Promise<void>;
    handleOrderOnHoldEvent(event: OrderOnHoldEvent): Promise<void>;
    handleOrderInTransitEvent(event: OrderInTransitEvent): Promise<void>;
    handleOrderDeliveredEvent(event: OrderDeliveredEvent): Promise<void>;
    handleContactTeamEvent(event: ContactTeamEvent): Promise<void>;
}
