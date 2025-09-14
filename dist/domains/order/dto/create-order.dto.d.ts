import { ItemInformation, ReceiverInformation, SenderInformation } from '../types';
export declare class CreateOrdersDto {
    items_info: ItemInformation[];
    receiver_info: ReceiverInformation;
    sender_info: SenderInformation;
}
