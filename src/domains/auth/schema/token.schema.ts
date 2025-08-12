import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose from "mongoose"
import bcrypt from "bcrypt"

export type ResetPasswordTokenDocument = mongoose.HydratedDocument<PasswordResetToken> & {
    isTokenValid: (token: string) => Promise<boolean>;
}


@Schema({ timestamps: true })
export class PasswordResetToken {
    @Prop({ required: true })
    email: string

    @Prop({ required: true })
    token: string

    @Prop({ required: true, expires: '15m' })
    expiresAt: Date

    @Prop({ required: true })
    status: string
}

export const PasswordResetTokenSchema = SchemaFactory.createForClass(PasswordResetToken)

PasswordResetTokenSchema.pre('save', async function (next) {
  const token = this as ResetPasswordTokenDocument;

  try {
    if (this.isModified('token')) {
      const salt = await bcrypt.genSalt(10);
      token.token = await bcrypt.hash(token.token, salt);
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

PasswordResetTokenSchema.methods.isTokenValid = async function (token: string): Promise<boolean> {
    if(this.expiresAt < Date.now()) {
        return false
    }

    return bcrypt.compare(token, this.token);
};