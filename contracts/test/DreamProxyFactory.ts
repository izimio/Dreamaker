import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

import {
    getTimeInSecond,
    fund,
    getEventsArgs,
    calculateFee,
    jumpLater,
    getBalanceOf,
} from "./utils";

const getAdmin = async () => {
    const admin = (await hre.ethers.getSigners()).slice(-1)[0];
    return admin;
};

const ZERO_ADDRESS = ethers.ZeroAddress;

const deployClone = async (
    proxyFactory: any,
    dreamOwner: string = "",
    targetAmount: bigint = 0n,
    deadlineTimestamp: bigint = 0n
) => {
    const [owner] = await hre.ethers.getSigners();

    dreamOwner = dreamOwner || owner.address;
    deadlineTimestamp = deadlineTimestamp || (await getTimeInSecond()) + 5000n;
    targetAmount = targetAmount || ethers.parseEther("1");

    const admin = await getAdmin();
    const tx = await proxyFactory
        .connect(admin)
        .deployClone(dreamOwner, targetAmount, deadlineTimestamp);
    const [proxyAddress, dreamOwnerAddress] = await getEventsArgs(tx);

    const dreamProxy = await hre.ethers.getContractAt("DreamV1", proxyAddress);

    expect(dreamProxy.target).to.not.equal(0);
    expect(dreamOwnerAddress).to.equal(dreamOwner);

    expect(await dreamProxy.admin()).to.equal(proxyFactory.target);

    return { dreamProxy, dreamOwnerAddress };
};

const deployCloneAndFundIt = async (
    proxyFactory: any,
    data: {
        dreamOwner?: string;
        targetAmount?: bigint;
        deadlineTimestamp?: bigint;
        funder?: any;
    } = {
        dreamOwner: "",
        targetAmount: 0n,
        deadlineTimestamp: 0n,
        funder: undefined,
    }
) => {
    data.funder = data.funder || (await hre.ethers.getSigners())[5];
    const targetAmount = data.targetAmount || ethers.parseEther("1");

    const proxy = await deployClone(
        proxyFactory,
        data.dreamOwner,
        targetAmount,
        data.deadlineTimestamp
    );
    const extra = Math.random().toString();
    const fundAmount = targetAmount + ethers.parseEther(extra);

    const fee = calculateFee(fundAmount, targetAmount);
    await fund(proxy.dreamProxy, data.funder, fundAmount);

    await jumpLater(6000);
    const signer = await hre.ethers.provider.getSigner(proxy.dreamOwnerAddress);

    expect(await proxy.dreamProxy.getAmount()).to.equal(fundAmount);
    await proxy.dreamProxy.connect(signer).withdraw();
    expect(await proxy.dreamProxy.getAmount()).to.equal(0);

    return {
        dreamProxy: proxy.dreamProxy,
        dreamOwnerAddress: proxy.dreamOwnerAddress,
        fundAmount,
        fee,
    };
};

describe("DreamFactory", function () {
    let singleton: any;

    this.beforeAll(async function () {
        const DreamV1 = await hre.ethers.getContractFactory("DreamV1");
        const dreamV1 = await DreamV1.deploy();
        singleton = dreamV1;
    });
    async function deployFixture() {
        const [owner, otherAccount] = await hre.ethers.getSigners();
        const admin = await getAdmin();
        const ProxyFactory =
            await hre.ethers.getContractFactory("DreamProxyFactory");
        const proxyFactory = await ProxyFactory.connect(admin).deploy(
            singleton.target
        );

        expect(await proxyFactory.implementationContract()).to.equal(
            singleton.target
        );
        expect(await proxyFactory.owner()).to.equal(admin.address);

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
        return { proxyFactory, owner, otherAccount, admin, errors };
    }

    describe("DreamProxyFactory, basic init values", function () {
        it("should deploy the DreamFactory contract", async function () {
            const { proxyFactory } = await loadFixture(deployFixture);
            expect(proxyFactory.target).to.not.equal(0);
        });
        it("Balance should be 0", async function () {
            const { proxyFactory } = await loadFixture(deployFixture);
            const balance = await proxyFactory.getBalance();
            expect(balance).to.equal(0);
        });
        it("should set the target contract", async function () {
            const { proxyFactory } = await loadFixture(deployFixture);
            expect(await proxyFactory.implementationContract()).to.equal(
                singleton.target
            );
        });
        it("should set the owner", async function () {
            const { proxyFactory, admin } = await loadFixture(deployFixture);
            expect(await proxyFactory.owner()).to.equal(admin.address);
        });
        it("get proxies", async function () {
            const { proxyFactory } = await loadFixture(deployFixture);
            const proxies = await proxyFactory.getProxies();
            expect(proxies.length).to.equal(0);
        });
        it("Change implementation contract", async function () {
            const { proxyFactory, admin } = await loadFixture(deployFixture);
            const randomAddress = ethers.Wallet.createRandom().address;
            await proxyFactory
                .connect(admin)
                .setImplementationContract(randomAddress);
            expect(await proxyFactory.implementationContract()).to.equal(
                randomAddress
            );
        });
        it("refuse change implementation contract if not owner", async function () {
            const { proxyFactory, otherAccount } =
                await loadFixture(deployFixture);
            const randomAddress = ethers.Wallet.createRandom().address;
            await expect(
                proxyFactory
                    .connect(otherAccount)
                    .setImplementationContract(randomAddress)
            ).to.be.revertedWithCustomError(proxyFactory, "Forbidden");
        });
    });
    describe("DreamProxyFactory, create proxy", function () {
        it("create proxy, basic", async function () {
            const { proxyFactory, otherAccount } =
                await loadFixture(deployFixture);
            const proxy = await deployClone(proxyFactory, otherAccount.address);

            expect(await proxy.dreamProxy.owner()).to.equal(
                otherAccount.address
            );
            expect(await proxy.dreamProxy.targetAmount()).to.equal(
                ethers.parseEther("1")
            );
            const proxies = await proxyFactory.getProxies();
            expect(proxies).to.eql([proxy.dreamProxy.target]);
        });
        it("create proxy, advanced", async function () {
            const { proxyFactory, otherAccount, owner } =
                await loadFixture(deployFixture);
            const proxy1 = await deployClone(
                proxyFactory,
                otherAccount.address
            );
            const proxy2 = await deployClone(
                proxyFactory,
                owner.address,
                ethers.parseEther("5")
            );

            expect(await proxy1.dreamProxy.targetAmount()).to.equal(
                ethers.parseEther("1")
            );
            expect(await proxy2.dreamProxy.targetAmount()).to.equal(
                ethers.parseEther("5")
            );

            const proxies = await proxyFactory.getProxies();
            expect(proxies).to.eql([
                proxy1.dreamProxy.target,
                proxy2.dreamProxy.target,
            ]);
            await fund(proxy1.dreamProxy, owner, ethers.parseEther("5"));

            const proxy2Balance = await proxy2.dreamProxy.getAmount();
            expect(proxy2Balance).to.equal(ethers.parseEther("0"));

            const proxy1Balance = await proxy1.dreamProxy.getAmount();
            expect(proxy1Balance).to.equal(ethers.parseEther("5"));
        });

        it("create proxy, errors", async function () {
            const { proxyFactory, otherAccount } =
                await loadFixture(deployFixture);
            const proxy1 = await deployClone(
                proxyFactory,
                otherAccount.address
            );

            await expect(
                proxy1.dreamProxy.connect(otherAccount).fund({
                    value: ethers.parseUnits("1", "wei"),
                })
            ).to.be.revertedWithCustomError(
                proxy1.dreamProxy,
                "FundingNotOpenToowner"
            );

            await expect(
                proxyFactory
                    .connect(otherAccount)
                    .setImplementationContract(ZERO_ADDRESS)
            ).to.be.revertedWithCustomError(proxyFactory, "Forbidden");
            await expect(
                proxyFactory
                    .connect(otherAccount)
                    .setImplementationContract(ZERO_ADDRESS)
            ).to.be.revertedWithCustomError(proxyFactory, "Forbidden");
        });
        it("create proxy, Invalid deploy", async function () {
            const { proxyFactory, otherAccount, admin } =
                await loadFixture(deployFixture);
            const dreamContract =
                await hre.ethers.getContractFactory("DreamV1");

            await expect(
                proxyFactory
                    .connect(admin)
                    .deployClone(
                        proxyFactory.target,
                        ethers.parseEther("1"),
                        5000000000n
                    )
            ).to.be.revertedWithCustomError(dreamContract, "Forbidden");
            await expect(
                proxyFactory.connect(admin).deployClone(ZERO_ADDRESS, 0, 0)
            ).to.be.revertedWithCustomError(
                dreamContract,
                "InvalidTargetAmount"
            );
            await expect(
                proxyFactory
                    .connect(admin)
                    .deployClone(
                        otherAccount.address,
                        ethers.parseEther("5"),
                        1n
                    )
            ).to.be.revertedWithCustomError(
                dreamContract,
                "InvalidDeadlineTimestamp"
            );
        });
    });
    describe("DreamProxyFactory, changeImplementation", function () {
        it("create proxy, errors", async function () {
            const { proxyFactory, otherAccount } =
                await loadFixture(deployFixture);
            await deployClone(proxyFactory, otherAccount.address);

            await expect(
                proxyFactory
                    .connect(otherAccount)
                    .setImplementationContract(ZERO_ADDRESS)
            ).to.be.revertedWithCustomError(proxyFactory, "Forbidden");
        });
        it("create proxy, changing implementation", async function () {
            const { proxyFactory } = await loadFixture(deployFixture);

            const newContract =
                await hre.ethers.getContractFactory("TestContract");
            const newImplementation = await newContract.deploy();

            const admin = await getAdmin();

            await proxyFactory
                .connect(admin)
                .setImplementationContract(newImplementation.target);

            const tx = await proxyFactory
                .connect(admin)
                .deployClone(ZERO_ADDRESS, 2n, 400000000n);
            const [proxyAddress] = await getEventsArgs(tx);

            const TestContract = await hre.ethers.getContractAt(
                "TestContract",
                proxyAddress
            );

            expect(await TestContract.value()).to.equal(0);
            await TestContract.setValue(5);
            expect(await TestContract.value()).to.equal(5);
        });
    });
    describe("DreamProxyFactory, amount increase with fees", function () {
        it("Balance updates correctly", async function () {
            const { proxyFactory } = await loadFixture(deployFixture);

            const balanceBefore = await proxyFactory.getBalance();
            expect(balanceBefore).to.equal(0);

            const { fee } = await deployCloneAndFundIt(proxyFactory);

            const balance = await proxyFactory.getBalance();
            expect(balance).to.equal(fee);
        });
        it("Balance updates correctly, multiple", async function () {
            const { proxyFactory, owner } = await loadFixture(deployFixture);

            const balanceBefore = await proxyFactory.getBalance();
            expect(balanceBefore).to.equal(0);

            const { fee: fee1 } = await deployCloneAndFundIt(proxyFactory);
            await jumpLater(500000);
            const { fee: fee2 } = await deployCloneAndFundIt(proxyFactory);

            const balance = await proxyFactory.getBalance();
            expect(balance).to.equal(fee1 + fee2);

            await owner.sendTransaction({
                to: proxyFactory.target,
                value: balance,
            });
            const balanceAfter = await proxyFactory.getBalance();
            expect(balanceAfter).to.equal(balance * 2n);
        });
    });
    describe("DreamProxyFactory, withdraw", function () {
        it("withdraw, basic", async function () {
            const { proxyFactory, admin } = await loadFixture(deployFixture);
            const { fee } = await deployCloneAndFundIt(proxyFactory);

            const balanceAdminbBefore = await getBalanceOf(admin);

            await proxyFactory.connect(admin).withdraw(fee, admin.address);
            const balanceAfter = await proxyFactory.getBalance();
            const balanceAdminAfter = await getBalanceOf(admin);

            expect(balanceAfter).to.equal(0);
            expect(balanceAdminAfter).to.equal(balanceAdminbBefore + fee);
        });
        it("withdraw, advanced", async function () {
            const { proxyFactory, admin, owner } =
                await loadFixture(deployFixture);
            const { fee } = await deployCloneAndFundIt(proxyFactory);

            const balanceAdminbBefore = await getBalanceOf(admin);

            await proxyFactory.connect(admin).withdraw(fee / 2n, admin.address);
            const balanceAfter = await proxyFactory.getBalance();
            const balanceAdminAfter = await getBalanceOf(admin);

            expect(balanceAfter).to.equal(fee / 2n);
            expect(balanceAdminAfter).to.equal(balanceAdminbBefore + fee / 2n);

            const balanceOwnerBefore = await getBalanceOf(owner);
            await proxyFactory.connect(admin).withdraw(fee / 2n, owner.address);
            const balanceAfter2 = await proxyFactory.getBalance();
            const balanceOwnerAfter = await getBalanceOf(owner);

            expect(balanceAfter2).to.equal(0);
            expect(balanceOwnerAfter).to.equal(balanceOwnerBefore + fee / 2n);
        });
        it("withdraw, errors", async function () {
            const { proxyFactory, admin, owner } =
                await loadFixture(deployFixture);
            const { fee } = await deployCloneAndFundIt(proxyFactory);

            await expect(
                proxyFactory.connect(admin).withdraw(fee + 1n, admin.address)
            ).to.be.revertedWithCustomError(
                proxyFactory,
                "AmountHigherThanBalance"
            );

            await expect(
                proxyFactory.connect(owner).withdraw(fee, owner.address)
            ).to.be.revertedWithCustomError(proxyFactory, "Forbidden");
        });
    });
});
