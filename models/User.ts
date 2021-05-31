import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  userId: string;
  email: string;
  emailVerified: boolean;
  username: string;
}

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  emailVerified: { type: Boolean, required: true },
  username: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema, "User");
export default User;
