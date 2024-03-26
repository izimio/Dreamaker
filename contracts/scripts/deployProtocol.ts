// scripts/deploy.js
import { ethers, upgrades } from "hardhat";

async function main() {

    const [deployer] = await ethers.getSigners();

    const Protocol = await ethers.getContractFactory("Protocol");
    console.log("Deploying Protocol...");

    const protocol = await Protocol.deploy();
    await protocol.waitForDeployment();

    const MyContractProxy = await ethers.getContractFactory("Protocol");
    const myContractProxy = await upgrades.deployProxy(MyContractProxy, [deployer.address]);
    await myContractProxy.waitForDeployment();

    const infos = {
        contractAddress: protocol.target,
        proxyAddress: myContractProxy.target,
    }

    console.table(infos);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
