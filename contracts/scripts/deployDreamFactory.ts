import { ethers } from "hardhat";

const DREAMV1 = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
    const [deployer] = await ethers.getSigners();

    const DreamProxyFactory =
        await ethers.getContractFactory("DreamProxyFactory");
    console.log("Deploying DreamProxyFactory...");

    const dreamProxyFactory = await DreamProxyFactory.deploy(
        deployer.address,
        DREAMV1
    );
    await dreamProxyFactory.waitForDeployment();

    const infos = {
        contractAddress: dreamProxyFactory.target,
    };

    console.table(infos);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
