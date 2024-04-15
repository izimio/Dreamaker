import { PROXY_ADDRESS } from "./utils";
import { task } from "hardhat/config";

task("fund", "Fund a dream")
    .addPositionalParam("proxy")
    .addOptionalPositionalParam("amount")
    .setAction(async (taskArgs, hre) => {
        const [owner] = await hre.ethers.getSigners();
        const randomWallet = hre.ethers.Wallet.createRandom().connect(hre.ethers.provider);

        const rAddr = taskArgs.proxy.length === 42 ? taskArgs.proxy : PROXY_ADDRESS;
        const proxy = await hre.ethers.getContractAt("DreamV1", rAddr, randomWallet);
        const targetAmount = await proxy.targetAmount();

        const ts = await owner.sendTransaction({
            to: randomWallet.address,
            value: hre.ethers.parseEther("10")
        })
        await ts.wait()
    
        const value = taskArgs.amount ? hre.ethers.parseEther(taskArgs.amount) : targetAmount;

        const txx = await proxy.fund({
            value
        })
        await txx.wait()

        console.table({
            proxy: rAddr,
            funder: randomWallet.address,
            value: value.toString()
        })
    });
