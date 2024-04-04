import mongoose from 'mongoose';

interface IFunder {
  address: string;
  amount: number;
}

export enum DreamStatus {
  ACTIVE = 'active',
  REACHED = 'reached',
  PENDING_VALIDATION = 'pending_validation',
  EXPIRED = 'expired',
}

export interface IDream {
  createdAt: Date;
  title: string;
  description: string;
  assets: string[];
  owner: string;
  deadlineTime: Date;
  status: DreamStatus;
  funders: IFunder[];
  targetAmount: bigint;
  minFundingAmount: bigint;
  proxyAddress: string;
}

const dreamSchema = new mongoose.Schema<IDream>({
  createdAt: { type: Date, default: Date.now },
  title: { type: String, required: true },
  description: { type: String, required: true },
  assets: { type: [String], default: [] },
  owner: { type: String, required: true },
  status: { type: String, required: true, default: DreamStatus.PENDING_VALIDATION },
  deadlineTime: { type: Date, required: true },
  funders: { type: [{ address: String, amount: Number }], default: [] },
  targetAmount: { type: BigInt, required: true},
  minFundingAmount: { type: BigInt, default: BigInt(1) },
  proxyAddress: { type: String, default: null },
});

export const DreamModel = mongoose.model<IDream>('Dream', dreamSchema);
