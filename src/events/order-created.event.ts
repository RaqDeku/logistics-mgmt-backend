export class OrderCreatedEvent {
    id: string
    type: string
    status: string
    estimated_delivery_date: string
    receiver_email: string
    net_weight: string
    receiver_name: string
}