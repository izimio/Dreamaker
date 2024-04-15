import { DEPLOYER_PRIVATE_KEY } from "../utils/config";
import { ethers } from "ethers";
import { DreamModel } from "../models/dreamModel";

export const getMyFunds = async (me: string) => {
    const dreamFunderByMe = await DreamModel.find({
        "funders.address": me,
    })
        .sort({ createdAt: 1 })
        .lean();

    let amountFunded: bigint = BigInt(0);

    dreamFunderByMe.map((dream: any) => {
        const amount: bigint = dream.funders.find(
            (funder: any) => funder.address === me
        ).amount;
        amountFunded += ethers.parseUnits(amount.toString(), "wei");
    });
    return {
        amountFunded: ethers.formatUnits(amountFunded, "ether"),
        fundedDreams: dreamFunderByMe,
    };
};

export const getMe = async (me: string) => {
    return me === new ethers.Wallet(DEPLOYER_PRIVATE_KEY).address;
};
