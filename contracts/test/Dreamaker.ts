import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";


const generateXRandomAccountsAndEarnings = async (x: number) => {
    const accounts = [];
    const earnings = [];

    for (let i = 0; i < x; i++) {
        const account = ethers.Wallet.createRandom();
        const earning = ethers.parseEther(Math.floor(Math.random() * 1000).toString());
        accounts.push(account);
        earnings.push(earning);
    }
    return { accounts, earnings };
}

const expectBalanceOfAccounts = async (dreamaker: any, accounts: any, earnings: any) => {
    for (let i = 0; i < accounts.length; i++) {
        expect(await dreamaker.balanceOf(accounts[i].address)).to.equal(earnings[i]);
    }
}

describe("Dreamaker Token", function () {
    async function deployFixture() {
        const [owner, otherAccount] = await hre.ethers.getSigners();
        const initialSupply = Math.floor(Math.random() * 5024011)
        const Dreamaker = await hre.ethers.getContractFactory("Dreamaker");
        const dreamaker = await Dreamaker.deploy(owner.address, initialSupply);

        const errors = {
            InvalidTargetAmount: "InvalidTargetAmount",
            InvalidDeadlineTimestamp: "InvalidDeadlineTimestamp",
            DreamFundingEnded: "DreamFundingEnded",
            DreamStillFunding: "DreamStillFunding",
            FundingNotOpenToowner: "FundingNotOpenToowner",
            BelowMinFundingAmount: "BelowMinFundingAmount",
            DreamDidNotReachTargetAmount: "DreamDidNotReachTargetAmount",
            NothingToRefund: "NothingToRefund",
            Forbidden: "Forbidden",
            InvalidInput: "InvalidInput",
        };
        return { dreamaker, owner, otherAccount, errors, initialSupply };
    }

    describe("Deployment - basic", function () {
        it("should set the owner", async function () {
            const { dreamaker, owner } = await deployFixture();
            expect(await dreamaker.owner()).to.equal(owner.address);
        });
        it("Should set correct owner default minting", async function () {
            const { dreamaker, owner, initialSupply } = await deployFixture();
            expect(await dreamaker.balanceOf(owner.address)).to.equal(ethers.parseEther(initialSupply.toString()));
        });
    });
    describe("Basic - transfer", function () {
        it("should transfer tokens", async function () {
            const { dreamaker, owner, otherAccount, initialSupply } = await deployFixture();
            await dreamaker.transfer(otherAccount.address, ethers.parseEther("100"));
            expect(await dreamaker.balanceOf(otherAccount.address)).to.equal(ethers.parseEther("100"));
            expect(await dreamaker.balanceOf(owner.address)).to.equal(ethers.parseEther(initialSupply.toString()) - ethers.parseEther("100"));
        });
        it("should not transfer tokens if not enough balance", async function () {
            const { dreamaker, otherAccount, initialSupply } = await deployFixture();
            await expect(dreamaker.transfer(otherAccount.address, ethers.parseEther((initialSupply + 5).toString()))).to.be.revertedWithCustomError(dreamaker,`
            ERC20InsufficientBalance(address,uint256,uint256)`)
        });
    });
    describe("Offering - dremaker", function () {

        it("Offerring - should not allow to set invalid target amount", async function () {
            const { dreamaker, errors } = await deployFixture();
            await expect(dreamaker.offer([], [])).to.be.revertedWithCustomError(dreamaker, errors.InvalidInput);
        });
        it("Offering - basic", async function () {
            const { dreamaker } = await deployFixture();
            const { accounts, earnings } = await generateXRandomAccountsAndEarnings(5);
            await expectBalanceOfAccounts(dreamaker, accounts, accounts.map(() => ethers.parseEther("0")));
            await dreamaker.offer(accounts, earnings);
            await expectBalanceOfAccounts(dreamaker, accounts, earnings);
        });
        it("Offering - fuzzing", async function () {
            const { dreamaker } = await deployFixture();
            const numberOfAccounts = Math.floor(Math.random() * 100);
            const { accounts, earnings } = await generateXRandomAccountsAndEarnings(numberOfAccounts);
            await expectBalanceOfAccounts(dreamaker, accounts, accounts.map(() => ethers.parseEther("0")));
            await dreamaker.offer(accounts, earnings);
            await expectBalanceOfAccounts(dreamaker, accounts, earnings);
        });
    });
});