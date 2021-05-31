import mongoose from "mongoose";

export interface IRefreshToken extends mongoose.Document {
  token: string;
}

const RefreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
});

const RefreshToken =
  mongoose.models.RefreshToken ||
  mongoose.model("RefreshToken", RefreshTokenSchema, "RefreshToken");
export default RefreshToken;
