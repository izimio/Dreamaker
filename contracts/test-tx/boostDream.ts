import { DREAMAKER_ADDRESS } from "./utils";
import { task } from "hardhat/config";

task("boost", "Boost dream")
    .addPositionalParam("proxyAddress")
    .addOptionalPositionalParam("amount")
    .setAction(async (taskArgs, hre) => {
        const PROXXY_ADDRESS = taskArgs.proxyAddress as string;
        const AMOUNT = taskArgs.amount as string;
    
        const amount = AMOUNT ? hre.ethers.parseEther(AMOUNT) : hre.ethers.parseEther("1");
        console.log("PROXXY_ADDRESS:", PROXXY_ADDRESS);
        const dreamaker = await hre.ethers.getContractAt("Dreamaker", DREAMAKER_ADDRESS);

        const res = await dreamaker.boost(PROXXY_ADDRESS, amount);
        const log = await res.wait();

        console.log("Boosted dreamaker");
    });
