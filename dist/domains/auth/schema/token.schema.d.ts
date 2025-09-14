import mongoose from "mongoose";
export type ResetPasswordTokenDocument = mongoose.HydratedDocument<PasswordResetToken> & {
    isTokenValid: (token: string) => Promise<boolean>;
};
export declare class PasswordResetToken {
    email: string;
    token: string;
    expiresAt: Date;
    status: string;
}
export declare const PasswordResetTokenSchema: mongoose.Schema<PasswordResetToken, mongoose.Model<PasswordResetToken, any, any, any, mongoose.Document<unknown, any, PasswordResetToken, any, {}> & PasswordResetToken & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, PasswordResetToken, mongoose.Document<unknown, {}, mongoose.FlatRecord<PasswordResetToken>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<PasswordResetToken> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
