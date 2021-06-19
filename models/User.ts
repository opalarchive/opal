import mongoose from "mongoose";

export interface UserData {
  userId: string;
  email: string;
  emailVerified: boolean;
  username: string;
}

// take only these props from an object with these props and possibly more
export const getUserData = (user: object & UserData) => {
  return {
    userId: user.userId,
    email: user.email,
    emailVerified: user.emailVerified,
    username: user.username,
  };
};

export interface IUser extends mongoose.Document, UserData {
  passwordHash: string;
}

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  emailVerified: { type: Boolean, required: true },
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema, "User");
export default User;
