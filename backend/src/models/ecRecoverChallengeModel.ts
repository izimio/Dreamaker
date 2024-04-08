import mongoose from "mongoose";

export interface IEcRecoverChallenge {
    createdAt: Date;
    address: string;
    challenge: string;
}

const ecRecoverChallengeSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now, expires: 180 },
    address: { type: String, required: true, match: /^0x[a-fA-F0-9]{40}$/, unique: true },
    challenge: { type: String, required: true },
});

export const EcRecoverChallengeModel = mongoose.model<IEcRecoverChallenge>("challenge", ecRecoverChallengeSchema);
