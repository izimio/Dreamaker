import mongoose from "mongoose";

export enum UserAction {
    CREATE = "CREATE",
    FUND = "FUND",
    REFUND = "REFUND",
    BOOST = "BOOST",
}
export interface IUser {
    createdAt: Date;
    address: string;
    actionHistory: {
        dreamId: string | null;
        action: string;
        amount: string;
        date: Date;
    }[];
}

const userSchema = new mongoose.Schema<IUser>({
    createdAt: { type: Date, default: Date.now },
    address: {
        type: String,
        required: true,
        match: /^0x[a-fA-F0-9]{40}$/,
        unique: true,
        transform: (v: string) => v.toLowerCase(),
    },
    actionHistory: [
        {
            dreamId: { type: String, default: null },
            action: { type: String, enum: Object.values(UserAction) },
            amount: { type: String, required: true },
            date: { type: Date, default: Date.now },
        },
    ],
});

export const UserModel = mongoose.model<IUser>("User", userSchema);
