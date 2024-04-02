import { ethers } from "hardhat";
import fs from "fs";


async function writeToFile(name: string, data: string) {
    try {
        fs.writeFileSync(name, data);
    } catch (error) {
        console.error(`Error writing to file ${name}:`, error);
    }
}

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

    console.log("🚀 Contracts deployed !");
    console.log("Admin: ", deployer.address);


    console.log(`\nDREAM_SINGLETON_ADDRESS=${dreamV1.info.target}\nDREAM_PROXY_FACTORY_ADDRESS=${dreamProxyFactory.info.target}\nDREAMAKER_ADDRESS=${dreamakerToken.info.target}`);

    const env = `${dreamV1.info.target};${dreamProxyFactory.info.target};${dreamakerToken.info.target}`;

    await writeToFile("./addrs", env);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
