import mongoose from "mongoose";

export interface IUser {
    createdAt: Date;
    address: string;
    boostHistory: {
        dreamId: string;
        amount: string;
        date: Date;
    }[];
    creationHistory: {
        dreamId: string;
        date: Date;
    }[];
    fundHistory: {
        dreamId: string;
        amount: string;
        date: Date;
    }[];
    refundHistory: {
        dreamId: string;
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
    boostHistory: {
        type: Array({
            dreamId: { type: String, required: true },
            amount: { type: String, required: true },
            date: { type: Date, required: true },
        }),
        default: [],
    },
    creationHistory: {
        type: Array({
            dreamId: { type: String, required: true },
            date: { type: Date, required: true },
        }),
        default: [],
    },
    fundHistory: {
        type: Array({
            dreamId: { type: String, required: true },
            amount: { type: String, required: true },
            date: { type: Date, required: true },
        }),
        default: [],
    },
    refundHistory: {
        type: Array({
            dreamId: { type: String, required: true },
            amount: { type: String, required: true },
            date: { type: Date, required: true },
        }),
        default: [],
    },
});

export const UserModel = mongoose.model<IUser>("User", userSchema);
