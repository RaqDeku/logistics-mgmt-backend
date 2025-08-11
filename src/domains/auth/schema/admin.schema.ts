import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose  from "mongoose";

export type AdminDocument = mongoose.HydratedDocument<Admin>

@Schema()
export class Admin {
  @Prop({required: true})
  email: string

  @Prop({required: true})
  password: string
}

export const AdminSchema = SchemaFactory.createForClass(Admin)

AdminSchema.pre('save', async function (next) {
  const admin = this as AdminDocument;
  if (!admin.isModified('password')) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     admin.password = await bcrypt.hash(admin.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
});

AdminSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
//   return bcrypt.compare(candidatePassword, this.password);
    return true;
};