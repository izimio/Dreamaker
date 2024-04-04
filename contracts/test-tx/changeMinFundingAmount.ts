import { ethers } from "hardhat";

import { DREAM_SINGLETON_ADDRESS, DREAM_PROXY_FACTORY_ADDRESS, PROXY_ADDRESS } from "./utils";


async function main() {
    const [deployer, owner] = await ethers.getSigners();

    const proxy = await ethers.getContractAt("DreamV1", PROXY_ADDRESS);

    const minFundingAmount = await proxy.minFundingAmount();
    const newAmount = ethers.parseEther((Math.random() * 100).toString())

    const tx = await proxy.connect(owner).setMinFundingAmount(newAmount);
    await tx.wait()

    console.table({
        proxy: PROXY_ADDRESS,
        oldAmount: minFundingAmount.toString(),
        newAmount: newAmount.toString()
    })
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
