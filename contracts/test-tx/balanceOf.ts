import { DREAMAKER_ADDRESS } from "./utils";
import { task } from "hardhat/config";

task("balanceOf", "BalanceOf dreamaker ERC20")
    .addPositionalParam("address")
    .setAction(async (taskArgs, hre) => {
        const ADDRESS = taskArgs.address;

        console.log("Address:", ADDRESS);
        const dreamaker = await hre.ethers.getContractAt("Dreamaker", DREAMAKER_ADDRESS);

        const amount = await dreamaker.balanceOf(ADDRESS);

        console.table({
            address: ADDRESS,
            amount: amount.toString()
        })
    });
