import { ethers } from "hardhat";

import {DREAM_PROXY_FACTORY_ADDRESS, PROXY_ADDRESS } from "./utils";

async function jumpAfterTimestamp(timestamp: number) {

    const now = Math.floor(Date.now() / 1000 - 1000)
    const diff = timestamp - now

    if (diff > 0) {
        console.log("Jumping", diff, "seconds")
        await ethers.provider.send("evm_increaseTime", [diff])
        await ethers.provider.send("evm_mine", [])
    }

}
async function main() {
    const [, owner] = await ethers.getSigners();

    const proxy = await ethers.getContractAt("DreamV1", PROXY_ADDRESS);

    const beforeBalance = await ethers.provider.getBalance(owner.address)

    const isFunded = await proxy.isDreamFunded();
    if (!isFunded) {
        console.log("Dream is not funded yet")
        return
    }
    const deadline = await proxy.deadlineTimestamp()

    await jumpAfterTimestamp(Number(deadline) + 1000)

    const tx = await proxy.connect(owner).withdraw(); 
    await tx.wait()

    const afterBalance = await ethers.provider.getBalance(owner.address)

    console.table({
        proxy: PROXY_ADDRESS,
        before: beforeBalance.toString(),
        after: afterBalance.toString()
    })
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
