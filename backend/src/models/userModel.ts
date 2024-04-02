import mongoose from 'mongoose';

export interface IUser {
  createdAt: Date;
  address: string;
}

const userSchema = new mongoose.Schema<IUser>({
  createdAt: { type: Date, default: Date.now },
  address: { type: String, required: true, match: /^0x[a-fA-F0-9]{40}$/ },
});

export const UserModel = mongoose.model<IUser>('User', userSchema);
