import { ethers } from "hardhat";

import { DREAM_SINGLETON_ADDRESS, DREAM_PROXY_FACTORY_ADDRESS } from "./utils";


async function main() {
    const [deployer] = await ethers.getSigners();

    const owner = ethers.Wallet.createRandom()
    const targetAmount = ethers.parseEther(Math.floor(Math.random() * 100).toString())
    const deadlineTime = Math.floor((Date.now() / 1000 )+ (Math.random() * 1000 * 60 * 60 * 24))

    console.log({
        owner: owner.address,
        targetAmount: targetAmount.toString(),
        deadlineTime: deadlineTime,
    });

    const dreamV1 = await ethers.getContractAt("DreamV1", DREAM_SINGLETON_ADDRESS);
    const dreamProxyFactory = await ethers.getContractAt("DreamProxyFactory", DREAM_PROXY_FACTORY_ADDRESS);

    // deploy Proxy
    const tx = await dreamProxyFactory.deployClone(owner.address, targetAmount, deadlineTime)
    const receipt = await tx.wait()

    console.log(`Proxy deployed at ${receipt!.logs[0].address}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
