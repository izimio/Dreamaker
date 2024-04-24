import mongoose from "mongoose";
import { TAGS } from "../utils/constants";

type IFunder = {
    address: string;
    amount: bigint;
};

type Asset = {
    type: string;
    link: string;
};

export enum DreamStatus {
    ACTIVE = "active",
    REACHED = "reached",
    PENDING_VALIDATION = "pending_validation",
    EXPIRED = "expired",
    WITHDRAWN = "withdrawn",
}

export interface IDream {
    createdAt: Date;
    title: string;
    description: string;
    assets: Asset[];
    owner: string;
    deadlineTime: number;
    status: DreamStatus;
    tags: string[];
    funders: IFunder[];
    targetAmount: string;
    minFundingAmount: string;
    proxyAddress: string;
    boostedUntil: Date;
    likers: string[];
    fundingGraph: {
        date: Date;
        amount: number;
    }[];
}

const dreamSchema = new mongoose.Schema<IDream>({
    createdAt: { type: Date, default: Date.now },
    title: { type: String, required: true },
    description: { type: String, required: true },
    assets: {
        type: Array({
            type: { type: String, required: true },
            link: { type: String, required: true },
        }),
        default: [],
    },
    owner: {
        type: String,
        required: true,
        transform: (v: string) => v.toLowerCase(),
    },
    status: {
        type: String,
        required: true,
        default: DreamStatus.PENDING_VALIDATION,
    },
    tags: {
        type: Array({ type: String, enum: TAGS }),
        default: [],
    },
    deadlineTime: { type: Number, required: true },
    funders: { type: [{ address: String, amount: BigInt }], default: [] },
    targetAmount: { type: String, required: true, match: /[1-9][0-9]*/ },
    minFundingAmount: { type: String, default: "1", match: /[1-9][0-9]*/ },
    proxyAddress: { type: String, default: null },
    boostedUntil: { type: Date, default: Date.now() - 5000 },
    likers: { type: [String], default: [] },
    fundingGraph: {
        type: Array({
            date: { type: Date, required: true, default: Date.now },
            amount: { type: Number, required: true },
        }),
        default: [],
    },
});

export const DreamModel = mongoose.model<IDream>("Dream", dreamSchema);
