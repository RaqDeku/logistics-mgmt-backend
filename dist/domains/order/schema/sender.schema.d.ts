import { HydratedDocument, Types } from 'mongoose';
import { Address } from '../types';
export type SenderDocument = HydratedDocument<Sender>;
export declare class Sender {
    full_name: string;
    mobile_number: string;
    email: string;
    address: Address;
    orders: Types.ObjectId[];
}
export declare const SenderSchema: import("mongoose").Schema<Sender, import("mongoose").Model<Sender, any, any, any, import("mongoose").Document<unknown, any, Sender, any, {}> & Sender & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Sender, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Sender>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Sender> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
