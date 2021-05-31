import mongoose from "mongoose";

export interface IPassword extends mongoose.Document {
  userId: string;
  hash: string;
}

const PasswordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  hash: { type: String, required: true },
});

const Password =
  mongoose.models.Password ||
  mongoose.model("Password", PasswordSchema, "Password");
export default Password;
