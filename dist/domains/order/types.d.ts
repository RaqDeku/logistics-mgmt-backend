export declare class Address {
    city: string;
    state: string;
    country: string;
    address: string;
    zip_code: string;
}
export declare class ReceiverInformation {
    full_name: string;
    mobile_number: string;
    email: string;
    address: Address;
}
export declare class SenderInformation {
    full_name: string;
    mobile_number: string;
    email: string;
    address: Address;
}
export declare class ItemInformation {
    item_type: string;
    item_description: string;
    net_weight: string;
    estimated_delivery_date: Date;
    revenue: number;
    estimated_value: number;
}
export declare class OrderResponseDto {
    order_id: string;
    item_type: string;
    sender: string;
    receiver: string | null;
    estimated_delivery_date: Date;
    status: string | null;
    is_on_hold: boolean;
    hold_reason?: string;
    hold_duration?: number;
    notes?: string;
}
export declare class CurrentHoldActivityDto {
    order_id: string;
    status: string;
    reason?: string;
    notes?: string;
    duration?: number;
    date: Date;
    placedBy: string;
}
export declare class GetOrderByIdResponseDto {
    order_id: string;
    item_type: string;
    item_description: string;
    net_weight: string;
    receiver: ReceiverInformation;
    sender: SenderInformation;
    estimated_delivery_date: Date;
    revenue: number;
    estimated_value: number;
    order_status: string | null;
    current_hold?: CurrentHoldActivityDto;
}
export declare class TrackOrderTimelineItemDto {
    status: string;
    date: Date;
    reason?: string;
    location?: string;
    notes?: string;
    duration?: number;
}
export declare class TrackOrderResponseDto {
    order_id: string;
    item_type: string;
    estimated_delivery_date: Date;
    status: string | null;
    timeline: TrackOrderTimelineItemDto[];
}
