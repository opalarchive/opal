import mongoose from "mongoose";
import { UserId } from "../utils/constants";

export interface IEmailVerfiyToken extends mongoose.Document {
  userId: UserId;
  verificationToken: string;
  creationDate: number;
}

const EmailVerifyTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  verificationToken: { type: String, required: true },
  creationDate: { type: Number, required: true },
});

const EmailVerifyToken =
  mongoose.models.EmailVerifyToken ||
  mongoose.model(
    "EmailVerifyToken",
    EmailVerifyTokenSchema,
    "EmailVerifyToken"
  );
export default EmailVerifyToken;
