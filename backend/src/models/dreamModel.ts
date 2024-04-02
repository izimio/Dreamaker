import mongoose from 'mongoose';

export interface IDream {
  createdAt: Date;
  title: string;
  description: string;
  assets: string[];
  owner: string;
  retributed: boolean;
  deadlineTime: Date;
  funders: string[];
  targetAmount: number;
  proxyAddress: string;
}

const dreamSchema = new mongoose.Schema<IDream>({
  createdAt: { type: Date, default: Date.now },
  title: { type: String, required: true },
  description: { type: String, required: true },
  assets: { type: [String], default: [] },
  owner: { type: String, required: true },
  retributed: { type: Boolean, default: false },
  deadlineTime: { type: Date, required: true },
  funders: { type: [String], default: [] },
  targetAmount: { type: Number, required: true, min: 1 },
  proxyAddress: { type: String, default: null },
});

export const DreamModel = mongoose.model<IDream>('Dream', dreamSchema);
