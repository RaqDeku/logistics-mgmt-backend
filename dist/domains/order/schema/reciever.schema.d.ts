import { HydratedDocument, Types } from 'mongoose';
import { Address } from '../types';
export type ReceiverDocument = HydratedDocument<Receiver>;
export declare class Receiver {
    full_name: string;
    mobile_number: string;
    email: string;
    address: Address;
    orders: Types.ObjectId[];
}
export declare const receiverSchema: import("mongoose").Schema<Receiver, import("mongoose").Model<Receiver, any, any, any, import("mongoose").Document<unknown, any, Receiver, any, {}> & Receiver & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Receiver, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Receiver>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Receiver> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
