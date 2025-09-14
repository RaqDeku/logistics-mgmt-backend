import * as mongoose from 'mongoose';
export type AdminDocument = mongoose.HydratedDocument<Admin> & {
    comparePassword: (password: string) => Promise<boolean>;
};
export declare class Admin {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    full_name: string;
}
export declare const AdminSchema: mongoose.Schema<Admin, mongoose.Model<Admin, any, any, any, mongoose.Document<unknown, any, Admin, any, {}> & Admin & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Admin, mongoose.Document<unknown, {}, mongoose.FlatRecord<Admin>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<Admin> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
