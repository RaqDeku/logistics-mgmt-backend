import { HydratedDocument, Types } from 'mongoose';
export type OrderActivityDocument = HydratedDocument<OrderActivity>;
export declare class OrderActivity {
    order_id: string;
    status: string;
    reason?: string;
    notes?: string;
    duration?: number;
    estimated_delivery_date?: Date;
    location?: string;
    date: Date;
    admin: Types.ObjectId;
}
export declare const orderActivitySchema: import("mongoose").Schema<OrderActivity, import("mongoose").Model<OrderActivity, any, any, any, import("mongoose").Document<unknown, any, OrderActivity, any, {}> & OrderActivity & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrderActivity, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<OrderActivity>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<OrderActivity> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
