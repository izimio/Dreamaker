import { EcRecoverChallengeModel } from "../models/ecRecoverChallengeModel";
import { UserModel } from "../models/userModel";
import {
    AuthError,
    ConflictError,
    InternalError,
    ObjectNotFoundError,
} from "../utils/error";
import { ethers } from "ethers";

const randomString = (length: number) => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
        characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
};

const TEMPLATE_CHALLENGE = (challenge: string) =>
    `Sign this message to prove you own the address: ${challenge}`;

async function verifySignature(
    challenge: string,
    signature: string,
    ethAddress: string
): Promise<boolean> {
    try {
        const recoveredAddress = ethers.verifyMessage(challenge, signature);

        return (
            ethers.getAddress(recoveredAddress) ===
            ethers.getAddress(ethAddress)
        );
    } catch (error) {
        return false;
    }
}

export const createEcRecoverChallenge = async (address: string) => {
    const challenge = TEMPLATE_CHALLENGE(randomString(128));

    try {
        await EcRecoverChallengeModel.create({ address, challenge });
    } catch (error: any) {
        if (error.code === 11000) {
            throw new ConflictError(
                "Challenge already exists for this address"
            );
        }
        throw new InternalError("Failed to create challenge", error);
    }

    return challenge;
};

export const verifyEcRecoverChallenge = async (
    address: string,
    signature: string
) => {
    const challenge = await EcRecoverChallengeModel.findOne({
        address,
    });

    if (!challenge) {
        throw new ObjectNotFoundError("Challenge not found");
    }

    const isValid = await verifySignature(
        challenge.challenge,
        signature,
        address
    );

    if (!isValid) {
        throw new AuthError("Invalid signature");
    }

    await UserModel.findOneAndUpdate(
        { address },
        {
            $set: {
                address,
                createdAt: new Date(),
                boostHistory: [],
                creationHistory: [],
                fundHistory: [],
            },
        },
        { upsert: true }
    );

    await EcRecoverChallengeModel.deleteOne({
        address,
    });

    return true;
};
