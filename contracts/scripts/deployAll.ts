import { ethers } from "hardhat";

async function deployContract(name: string, args: any[]) {
    const Contract = await ethers.getContractFactory(name);

    const contract = await Contract.deploy(...args);
    await contract.waitForDeployment();
    // get the address of the account that deployed the contract
    console.log(`🚀 ${name} deployed !`);
    return {
        contract,
        info: {
            target: contract.target,
            deployer: contract.deploymentTransaction()?.from,
        },
    };
}

async function main() {
    const [deployer] = await ethers.getSigners();

    const dreamV1 = await deployContract("DreamV1", []);
    const dreamProxyFactory = await deployContract("DreamProxyFactory", [
        dreamV1.info.target,
    ]);

    const dreamakerToken = await deployContract("Dreamaker", [
        deployer.address,
        100_000
    ]);

    console.table({
        DreamV1: dreamV1.info,
        DreamProxyFactory: dreamProxyFactory.info,
        Dreamaker: dreamakerToken.info,
        admin: {
            target: deployer.address,
        },
    });
    console.log(`
    DREAM_SINGLETON_ADDRESS=${dreamV1.info.target}
DREAM_PROXY_FACTORY_ADDRESS=${dreamProxyFactory.info.target}
DREAMAKER_ADDRESS=${dreamakerToken.info.target}
    `)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
