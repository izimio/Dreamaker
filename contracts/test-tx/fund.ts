import { ethers } from "hardhat";

import { DREAM_SINGLETON_ADDRESS, DREAM_PROXY_FACTORY_ADDRESS, PROXY_ADDRESS } from "./utils";

async function main() {
    const [deployer] = await ethers.getSigners();

    const proxy = await ethers.getContractAt("DreamV1", PROXY_ADDRESS);

    const minFundingAmount = await proxy.minFundingAmount();
    const targetAmount = await proxy.targetAmount();

    const txx = await proxy.fund({
        value: targetAmount
    })
    await txx.wait()

    console.table({
        proxy: PROXY_ADDRESS,
        value: targetAmount
    })
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
