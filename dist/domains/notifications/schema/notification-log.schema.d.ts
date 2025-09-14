import { HydratedDocument } from 'mongoose';
export type NotificationActivityLogDocument = HydratedDocument<NotificationActivityLog>;
export declare class NotificationActivityLog {
    order_id: string;
    recipient_email: string;
    subject: string;
    status: string;
    sent_at: Date;
}
export declare const NotificationActivityLogSchema: import("mongoose").Schema<NotificationActivityLog, import("mongoose").Model<NotificationActivityLog, any, any, any, import("mongoose").Document<unknown, any, NotificationActivityLog, any, {}> & NotificationActivityLog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, NotificationActivityLog, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<NotificationActivityLog>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<NotificationActivityLog> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
