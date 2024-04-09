import fs from "fs";
import { task } from "hardhat/config";

async function writeToFile(name: string, data: string) {
    try {
        fs.writeFileSync(name, data);
    } catch (error) {
        console.error(`Error writing to file ${name}:`, error);
    }
}

task("deployAll", "Deploy all contracts")
    .addOptionalPositionalParam("silent", "Silent mode")
    .setAction(async (taskArgs, hre) => {

        const silent = taskArgs.silent === "true";

        function log(...args: any[]) {
            if (!silent) {
                console.log(...args);
            }
        }

        async function deployContract(name: string, args: any[]) {
            const Contract = await hre.ethers.getContractFactory(name);

            const contract = await Contract.deploy(...args);
            await contract.waitForDeployment();
            // get the address of the account that deployed the contract
            log(`🚀 ${name} deployed !`);
            return {
                contract,
                info: {
                    target: contract.target,
                    deployer: contract.deploymentTransaction()?.from,
                },
            };
        }

        const [deployer] = await hre.ethers.getSigners();

        const dreamV1 = await deployContract("DreamV1", []);
        const dreamProxyFactory = await deployContract("DreamProxyFactory", [
            dreamV1.info.target,
        ]);

        const dreamakerToken = await deployContract("Dreamaker", [
            deployer.address,
            100_000
        ]);

        log("🚀 Contracts deployed !");
        log("Admin: ", deployer.address);


        log(`\nDREAM_SINGLETON_ADDRESS=${dreamV1.info.target}\nDREAM_PROXY_FACTORY_ADDRESS=${dreamProxyFactory.info.target}\nDREAMAKER_ADDRESS=${dreamakerToken.info.target}`);

        const env = `${dreamV1.info.target};${dreamProxyFactory.info.target};${dreamakerToken.info.target}`;

        await writeToFile("./addrs", env);

    });
