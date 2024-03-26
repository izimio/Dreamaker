import mongoose from "mongoose";

export interface IUser {
  createdAt: Date;
  email: string;
  username: string;
  password: string;
  tokens: {
    blue: number;
    free: number;
    spiceTokens: number;
  };
  // to continue
}

const userSchema = new mongoose.Schema<IUser>({
  createdAt: { type: Date, default: Date.now },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tokens: {
    blue: { type: Number, default: 0 },
    free: { type: Number, default: 0 },
    spiceTokens: { type: Number, default: 0 },
  },
});

export const UserModel = mongoose.model<IUser>("User", userSchema);