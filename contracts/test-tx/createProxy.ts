import { ethers } from "hardhat";

import {DREAM_PROXY_FACTORY_ADDRESS, preprendToaddr } from "./utils";


async function main() {
    const [, owner] = await ethers.getSigners();

    const nowTime = await ethers.provider.getBlock('latest')
    if (!nowTime) {
        console.log("Failed to get the current time");
        return;
    }
    
    const targetAmount = ethers.parseEther("1");
    const deadlineTime = Math.floor(nowTime?.timestamp + (Math.random() * 1000 * 60 * 60 * 24))

    const dreamProxyFactory = await ethers.getContractAt("DreamProxyFactory", DREAM_PROXY_FACTORY_ADDRESS);

    // deploy Proxy
    const tx = await dreamProxyFactory.deployClone(owner.address, targetAmount, deadlineTime)
    const receipt = await tx.wait()
    const events = receipt?.logs[0]
    const proxyAddr = events.args[0] || "";
    if (!proxyAddr) {
        console.log("Tx failed");
        return;
    }

    console.table({
        owner: owner.address,
        tamount: targetAmount,
        deadline: deadlineTime,
        proxy: proxyAddr    
    })
    preprendToaddr(proxyAddr);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
