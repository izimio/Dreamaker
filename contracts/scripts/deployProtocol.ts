// scripts/deploy.js
import { ethers } from "hardhat";

async function main() {
    const Protocol = await ethers.getContractFactory("DreamV1");
    console.log("Deploying DreamV1...");

    const protocol = await Protocol.deploy();
    await protocol.waitForDeployment();

    const infos = {
        contractAddress: protocol.target,
    };

    console.table(infos);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
