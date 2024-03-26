// scripts/deploy.js
import { ethers, upgrades } from "hardhat";

async function main() {

    const [deployer] = await ethers.getSigners();

    const Dreamaker = await ethers.getContractFactory("Dreamaker");
    console.log("Deploying Dreamaker...");

    const dreamaker = await Dreamaker.deploy();
    await dreamaker.waitForDeployment();

    const MyContractProxy = await ethers.getContractFactory("Dreamaker");
    const myContractProxy = await upgrades.deployProxy(MyContractProxy, [deployer.address]);
    await myContractProxy.waitForDeployment();

    const infos = {
        contractAddress: dreamaker.target,
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
