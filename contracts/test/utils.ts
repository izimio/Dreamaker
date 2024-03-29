import { expect } from "chai";
import { ethers } from "hardhat";

export const getTimeInSecond = async () => {
    const currentTimestamp = (await ethers.provider.getBlock("latest"))!
        .timestamp;
    return BigInt(currentTimestamp);
};

export const jumpLater = async (seconds: number) => {
    const currentTimestamp = (await ethers.provider.getBlock("latest"))!
        .timestamp;

    await ethers.provider.send("evm_mine", [currentTimestamp + seconds]); // Mining a block 1 hour later
};

export const getBalanceOf = async (account: any) => {
    return ethers.provider.getBalance(account.address);
};

export const fund = async (dreamV1: any, account: any, value: any) => {
    await expect(dreamV1.connect(account).fund({ value }))
        .to.emit(dreamV1, "DreamFunded")
        .withArgs(account.address, value);
};

export const refund = async (dreamV1: any, account: any) => {
    const balanceBefore = await getBalanceOf(account);
    const value = await dreamV1.getFundedAmount(account.address);
    await expect(dreamV1.connect(account).refund())
        .to.emit(dreamV1, "DreamRefunded")
        .withArgs(account.address, value);
    const balanceAfter = await getBalanceOf(account);
    expect(balanceAfter).to.equal(balanceBefore + value);

    const fundedAmount = await dreamV1.getFundedAmount(account.address);
    expect(fundedAmount).to.equal(0);
};

export const calculateFee = (amount: bigint, targetAmount: bigint) => {
    const extra = BigInt(amount - targetAmount);

    const baseFee = targetAmount / 100n;

    const extraFee = extra / 50n;

    return baseFee + extraFee;
};

export const getEventsArgs = async (tx: any) => {
    const events = await tx.wait();

    const event = events!.logs![0];
    return event.args;
};
