import { ethers } from "hardhat";

import { PROXY_ADDRESS } from "./utils";

async function main() {
    const proxy = await ethers.getContractAt("DreamV1", PROXY_ADDRESS);

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
