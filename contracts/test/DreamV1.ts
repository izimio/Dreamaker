import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import {
    jumpLater,
    getBalanceOf,
    getTimeInSecond,
    fund,
    refund,
    calculateFee,
} from "./utils";

describe("DreamV1", function () {
    async function deployFixture() {
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const DreamV1 = await hre.ethers.getContractFactory("DreamV1");
        const dreamV1 = await DreamV1.deploy();

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
        };
        return { dreamV1, owner, otherAccount, errors };
    }

    async function deployInitializedFixture({
        dreamOwner = "",
        targetAmount = 0n,
        deadlineTimestamp = 0n,
    } = {}) {
        const { dreamV1, owner, otherAccount, errors } =
            await loadFixture(deployFixture);

        const admin = (await hre.ethers.getSigners()).slice(-1)[0];
        const currentTimestamp = (await ethers.provider.getBlock("latest"))!
            .timestamp;

        deadlineTimestamp =
            deadlineTimestamp || BigInt(currentTimestamp + 50000);
        dreamOwner = owner.address || dreamOwner;

        await dreamV1
            .connect(admin)
            .initialize(dreamOwner, targetAmount, deadlineTimestamp);

        expect(await dreamV1.connect(owner).isInitialized()).to.equal(true);

        return { dreamV1, owner, otherAccount, errors, admin };
    }

    describe("Basic + Init", function () {
        it("should have the right default values", async function () {
            const { dreamV1 } = await loadFixture(deployFixture);

            expect(await dreamV1.owner()).to.equal(
                ethers.getAddress("0x0000000000000000000000000000000000000000")
            );

            expect(await dreamV1.isDreamFunded()).to.equal(true);

            expect(await dreamV1.isDreamEnded()).to.equal(true);

            expect(await dreamV1.minFundingAmount()).to.equal(0);

            expect(await dreamV1.getAmount()).to.equal(0);
        });
        it("should initialize correctly", async function () {
            const { dreamV1, owner, otherAccount } =
                await loadFixture(deployFixture);

            await dreamV1
                .connect(otherAccount)
                .initialize(owner.address, 1000, getTimeInSecond() + 50000);

            await expect(dreamV1.setMinFundingAmount(ethers.parseEther("0.1")))
                .to.emit(dreamV1, "MinFundingAmountChanged")
                .withArgs(ethers.parseEther("0.1"));

            expect(await dreamV1.owner()).to.equal(owner.address);

            expect(await dreamV1.isDreamFunded()).to.equal(false);

            expect(await dreamV1.isDreamEnded()).to.equal(false);

            expect(await dreamV1.minFundingAmount()).to.equal(
                ethers.parseEther("0.1")
            );

            expect(await dreamV1.admin()).to.equal(otherAccount.address);
            expect(await dreamV1.getAmount()).to.equal(0);
            expect(await dreamV1.isInitialized()).to.equal(true);
        });
        it("Should revert for bad initialization inputs", async function () {
            const { dreamV1, owner, errors, otherAccount } =
                await loadFixture(deployFixture);

            await expect(
                dreamV1.initialize(otherAccount.address, 1, 10000)
            ).to.be.revertedWithCustomError(
                dreamV1,
                errors.InvalidDeadlineTimestamp
            );

            await expect(
                dreamV1.initialize(otherAccount.address, 0, 10000)
            ).to.be.revertedWithCustomError(
                dreamV1,
                errors.InvalidTargetAmount
            );

            await expect(
                dreamV1.initialize(
                    otherAccount.address,
                    1000,
                    getTimeInSecond() - 1
                )
            ).to.be.revertedWithCustomError(
                dreamV1,
                errors.InvalidDeadlineTimestamp
            );
            await expect(
                dreamV1.initialize(
                    otherAccount.address,
                    1000,
                    getTimeInSecond() - 100
                )
            ).to.be.revertedWithCustomError(
                dreamV1,
                errors.InvalidDeadlineTimestamp
            );

            await expect(
                dreamV1
                    .connect(owner)
                    .initialize(owner.address, 0, getTimeInSecond() + 100)
            ).to.be.revertedWithCustomError(dreamV1, errors.Forbidden);
            expect(await dreamV1.isInitialized()).to.equal(false);
        });
        it("Should refuse re-initialization", async function () {
            const { dreamV1, errors, otherAccount } =
                await loadFixture(deployFixture);

            expect(await dreamV1.isInitialized()).to.equal(false);
            await dreamV1.initialize(
                otherAccount.address,
                1,
                getTimeInSecond() + 50000
            );
            expect(await dreamV1.isInitialized()).to.equal(true);

            await expect(
                dreamV1.initialize(
                    otherAccount.address,
                    1,
                    getTimeInSecond() + 50
                )
            ).to.be.revertedWithCustomError(dreamV1, errors.Forbidden);
        });
    });

    describe("Fund dream", function () {
        it("Fund dream, basic", async function () {
            const { dreamV1, owner, otherAccount } =
                await deployInitializedFixture({
                    targetAmount: BigInt(ethers.parseEther("1")),
                });

            await fund(dreamV1, otherAccount, ethers.parseEther("0.5"));

            expect(await dreamV1.getAmount()).to.equal(
                ethers.parseEther("0.5")
            );
            expect(await dreamV1.isDreamFunded()).to.equal(false);
            expect(
                await dreamV1.getFundedAmount(otherAccount.address)
            ).to.equal(ethers.parseEther("0.5"));
            expect(await dreamV1.getFundedAmount(owner.address)).to.equal(
                ethers.parseEther("0")
            );
        });
        it("Fund dream, advanced", async function () {
            const [, , third] = await hre.ethers.getSigners();
            const { dreamV1, otherAccount } = await deployInitializedFixture({
                targetAmount: BigInt(ethers.parseEther("1")),
            });

            await fund(dreamV1, otherAccount, ethers.parseEther("0.5"));

            expect(await dreamV1.getAmount()).to.equal(
                ethers.parseEther("0.5")
            );
            expect(
                await dreamV1.getFundedAmount(otherAccount.address)
            ).to.equal(ethers.parseEther("0.5"));
            expect(await dreamV1.isDreamFunded()).to.equal(false);

            await fund(dreamV1, third, ethers.parseEther("0.5"));
            expect(await dreamV1.getAmount()).to.equal(ethers.parseEther("1"));
            expect(await dreamV1.getFundedAmount(third.address)).to.equal(
                ethers.parseEther("0.5")
            );
            expect(await dreamV1.isDreamFunded()).to.equal(true);

            expect(await dreamV1.getFunders()).to.eql([
                otherAccount.address,
                third.address,
            ]);
        });
        it("Fund dream, advanced, same user", async function () {
            const { dreamV1, otherAccount } = await deployInitializedFixture({
                targetAmount: BigInt(ethers.parseEther("1")),
            });

            await fund(dreamV1, otherAccount, ethers.parseEther("0.5"));

            expect(await dreamV1.getAmount()).to.equal(
                ethers.parseEther("0.5")
            );
            expect(
                await dreamV1.getFundedAmount(otherAccount.address)
            ).to.equal(ethers.parseEther("0.5"));
            expect(await dreamV1.isDreamFunded()).to.equal(false);

            await fund(dreamV1, otherAccount, ethers.parseEther("0.5"));

            expect(await dreamV1.getAmount()).to.equal(ethers.parseEther("1"));
            expect(
                await dreamV1.getFundedAmount(otherAccount.address)
            ).to.equal(ethers.parseEther("1"));
            expect(await dreamV1.isDreamFunded()).to.equal(true);

            expect(await dreamV1.funders(0)).to.equal(otherAccount.address);
            await expect(dreamV1.funders(1)).to.be.reverted;
        });
        it("Fund dream, error fund ended", async function () {
            const { dreamV1, otherAccount, errors } =
                await deployInitializedFixture({
                    targetAmount: BigInt(ethers.parseEther("1")),
                    deadlineTimestamp: BigInt(getTimeInSecond() + 500000),
                });
            await jumpLater(5000001);
            await expect(
                dreamV1
                    .connect(otherAccount)
                    .fund({ value: ethers.parseEther("0.5") })
            ).to.be.revertedWithCustomError(dreamV1, errors.DreamFundingEnded);
        });
        it("Fund dream, error checking", async function () {
            const { dreamV1, owner, otherAccount, errors } =
                await deployInitializedFixture({
                    targetAmount: BigInt(ethers.parseEther("1")),
                });
            await dreamV1.setMinFundingAmount(ethers.parseEther("0.1"));
            expect(await dreamV1.minFundingAmount()).to.equal(
                ethers.parseEther("0.1")
            );

            await expect(
                dreamV1
                    .connect(otherAccount)
                    .fund({ value: ethers.parseEther("0.05") })
            ).to.be.revertedWithCustomError(
                dreamV1,
                errors.BelowMinFundingAmount
            );

            await expect(
                dreamV1.connect(owner).fund({ value: ethers.parseEther("0.5") })
            ).to.be.revertedWithCustomError(
                dreamV1,
                errors.FundingNotOpenToowner
            );
        });
    });
    describe("Withdraw dream", function () {
        it("Withdraw dream, basic", async function () {
            const { dreamV1, owner, otherAccount, admin } =
                await deployInitializedFixture({
                    targetAmount: BigInt(ethers.parseEther("1")),
                });
            await fund(dreamV1, otherAccount, ethers.parseEther("2"));
            expect(await dreamV1.getAmount()).to.equal(ethers.parseEther("2"));
            expect(await dreamV1.isDreamFunded()).to.equal(true);
            expect(
                await dreamV1.getFundedAmount(otherAccount.address)
            ).to.equal(ethers.parseEther("2"));
            expect(await dreamV1.getAmount()).to.equal(ethers.parseEther("2"));
            // Ending the dream funding
            await jumpLater(500001);

            const adminBalance = await getBalanceOf(admin);
            const ownerBalanceBefore = await getBalanceOf(owner);

            const fee = calculateFee(
                ethers.parseEther("2"),
                ethers.parseEther("1")
            );
            const tx = await dreamV1.connect(owner).withdraw();
            const receipt = await tx.wait();
            await expect(receipt)
                .to.emit(dreamV1, "DreamWithdrawn")
                .withArgs(owner.address, ethers.parseEther("2") - fee, fee);
            expect(await dreamV1.getAmount()).to.equal(0);

            const ownerBalance = await getBalanceOf(owner);

            expect(ownerBalance).to.equal(
                ownerBalanceBefore + (ethers.parseEther("2") - fee)
            );
            expect(await getBalanceOf(admin)).to.equal(adminBalance + fee);
        });
        it("Withdraw dream, advanced", async function () {
            const [, , third, fourth] = await hre.ethers.getSigners();
            const { dreamV1, owner, otherAccount, admin } =
                await deployInitializedFixture({
                    targetAmount: BigInt(ethers.parseEther("7")),
                });
            await fund(dreamV1, otherAccount, ethers.parseEther("0.00145478"));
            await fund(dreamV1, third, ethers.parseEther("1.9"));
            await fund(dreamV1, fourth, ethers.parseEther("5.2"));
            expect(await dreamV1.getAmount()).to.equal(
                ethers.parseEther("7.10145478")
            );
            expect(await dreamV1.isDreamFunded()).to.equal(true);

            expect(await dreamV1.getFundedAmount(third.address)).to.equal(
                ethers.parseEther("1.9")
            );
            expect(await dreamV1.getFundedAmount(fourth.address)).to.equal(
                ethers.parseEther("5.2")
            );
            expect(
                await dreamV1.getFundedAmount(otherAccount.address)
            ).to.equal(ethers.parseEther("0.00145478"));

            await jumpLater(500001);

            const adminBalance = await getBalanceOf(admin);
            const ownerBalanceBefore = await getBalanceOf(owner);
            const amount = await dreamV1.getAmount();

            const fee = calculateFee(amount, ethers.parseEther("7"));

            const tx = await dreamV1.connect(owner).withdraw();
            const receipt = await tx.wait();
            await expect(receipt)
                .to.emit(dreamV1, "DreamWithdrawn")
                .withArgs(owner.address, amount - fee, fee);

            expect(await dreamV1.getAmount()).to.equal(0);

            const ownerBalance = await getBalanceOf(owner);

            expect(ownerBalance).to.equal(ownerBalanceBefore + (amount - fee));
            expect(await getBalanceOf(admin)).to.equal(adminBalance + fee);
        });
        it("Withdraw dream, modifier errors", async function () {
            const { dreamV1, owner, otherAccount, errors } =
                await deployInitializedFixture({
                    targetAmount: BigInt(ethers.parseEther("50")),
                });
            await fund(dreamV1, otherAccount, ethers.parseEther("1"));
            expect(await dreamV1.isDreamFunded()).to.equal(false);

            // refuse to withdraw if not admin
            await expect(
                dreamV1.connect(otherAccount).withdraw()
            ).to.be.revertedWithCustomError(dreamV1, errors.Forbidden);

            await fund(dreamV1, otherAccount, ethers.parseEther("65"));

            // refuse to withdraw if not ended yet and even funded
            await expect(
                dreamV1.connect(owner).withdraw()
            ).to.be.revertedWithCustomError(dreamV1, errors.DreamStillFunding);
        });
        it("Withdraw dream, logic errors", async function () {
            const { dreamV1, owner, otherAccount, errors } =
                await deployInitializedFixture({
                    targetAmount: BigInt(ethers.parseEther("50")),
                });
            await fund(dreamV1, otherAccount, ethers.parseEther("1"));
            expect(await dreamV1.isDreamFunded()).to.equal(false);

            await jumpLater(500001);

            // refuse to withdraw if not admin
            await expect(
                dreamV1.connect(otherAccount).withdraw()
            ).to.be.revertedWithCustomError(dreamV1, errors.Forbidden);

            // refuse to withdraw if not funded
            await expect(
                dreamV1.connect(owner).withdraw()
            ).to.be.revertedWithCustomError(
                dreamV1,
                errors.DreamDidNotReachTargetAmount
            );
        });
    });

    describe("Refund dream", function () {
        it("Refund dream, basic", async function () {
            const { dreamV1, otherAccount } = await deployInitializedFixture({
                targetAmount: BigInt(ethers.parseEther("1")),
            });

            await fund(dreamV1, otherAccount, ethers.parseEther("0.9"));
            expect(await dreamV1.getAmount()).to.equal(
                ethers.parseEther("0.9")
            );
            expect(await dreamV1.isDreamFunded()).to.equal(false);
            expect(
                await dreamV1.getFundedAmount(otherAccount.address)
            ).to.equal(ethers.parseEther("0.9"));

            // Ending the dream funding
            await jumpLater(500001);

            await refund(dreamV1, otherAccount);

            expect(await dreamV1.getAmount()).to.equal(0);
        });
        it("Refund dream, advanced", async function () {
            const [, , third] = await hre.ethers.getSigners();
            const { dreamV1, otherAccount } = await deployInitializedFixture({
                targetAmount: BigInt(ethers.parseEther("1")),
            });

            await fund(dreamV1, otherAccount, ethers.parseEther("0.4"));
            await fund(dreamV1, third, ethers.parseEther("0.000487848"));
            // Ending the dream funding
            await jumpLater(500001);

            await refund(dreamV1, otherAccount);
            await refund(dreamV1, third);

            expect(await dreamV1.getAmount()).to.equal(0);
        });
        it("Refund dream, not a contributor", async function () {
            const [, , third] = await hre.ethers.getSigners();
            const { dreamV1, otherAccount, errors } =
                await deployInitializedFixture({
                    targetAmount: BigInt(ethers.parseEther("1")),
                });

            await fund(dreamV1, otherAccount, ethers.parseEther("0.4"));

            // Ending the dream funding
            await jumpLater(500001);

            await refund(dreamV1, otherAccount);
            await expect(
                dreamV1.connect(third).refund()
            ).to.be.revertedWithCustomError(dreamV1, errors.NothingToRefund);
        });
        it("Refund dream, cannot refund if target reached", async function () {
            const { dreamV1, otherAccount, errors } =
                await deployInitializedFixture({
                    targetAmount: BigInt(ethers.parseEther("1")),
                });

            await fund(dreamV1, otherAccount, ethers.parseEther("1.4"));

            // Ending the dream funding
            await jumpLater(500001);

            await expect(
                dreamV1.connect(otherAccount).refund()
            ).to.be.revertedWithCustomError(dreamV1, errors.NothingToRefund);
        });
        it("Refund dream, dream not ended", async function () {
            const { dreamV1, otherAccount, errors } =
                await deployInitializedFixture({
                    targetAmount: BigInt(ethers.parseEther("1")),
                });

            await fund(dreamV1, otherAccount, ethers.parseEther("1.4"));

            await expect(
                dreamV1.connect(otherAccount).refund()
            ).to.be.revertedWithCustomError(dreamV1, errors.DreamStillFunding);
        });
    });
    describe("Receive fallback", function () {
        it("Receive fallback, basic", async function () {
            const { dreamV1, otherAccount } = await deployInitializedFixture({
                targetAmount: BigInt(ethers.parseEther("1")),
            });

            await otherAccount.sendTransaction({
                to: dreamV1.target,
                value: ethers.parseEther("0.5"),
            });

            expect(await dreamV1.getAmount()).to.equal(
                ethers.parseEther("0.5")
            );
            expect(await dreamV1.isDreamFunded()).to.equal(false);
            expect(
                await dreamV1.getFundedAmount(otherAccount.address)
            ).to.equal(ethers.parseEther("0.5"));
        });
        it("Receive fallback, advanced", async function () {
            const [, , third] = await hre.ethers.getSigners();
            const { dreamV1, otherAccount } = await deployInitializedFixture({
                targetAmount: BigInt(ethers.parseEther("1")),
            });

            await third.sendTransaction({
                to: dreamV1.target,
                value: ethers.parseEther("0.5"),
            });

            await otherAccount.sendTransaction({
                to: dreamV1.target,
                value: ethers.parseEther("45"),
            });

            expect(await dreamV1.getAmount()).to.equal(
                ethers.parseEther("45.5")
            );
            expect(await dreamV1.isDreamFunded()).to.equal(true);
            expect(await dreamV1.getFundedAmount(third.address)).to.equal(
                ethers.parseEther("0.5")
            );
            expect(
                await dreamV1.getFundedAmount(otherAccount.address)
            ).to.equal(ethers.parseEther("45"));
        });
    });
});
