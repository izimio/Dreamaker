import { DREAMAKER_ADDRESS } from "./utils";
import { task } from "hardhat/config";

task("giveMoney", "BalanceOf dreamaker ERC20")
    .addPositionalParam("address")
    .addOptionalPositionalParam("amount")
    .setAction(async (taskArgs, hre) => {
        const ADDRESS = taskArgs.address;
        const AMOUNT = taskArgs.amount || "1";
        
        const [deployer] = await hre.ethers.getSigners();
        
        await deployer.sendTransaction({
            to: ADDRESS,
            value: hre.ethers.parseEther(AMOUNT),
        });
        console.log(`Sent ${AMOUNT} ETH to ${ADDRESS}`);
    });
