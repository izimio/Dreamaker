import { task } from "hardhat/config";

task("sign", "Sign a challenge")
    .addPositionalParam("challenge")
    .addOptionalPositionalParam("privateKey")
    .setAction(async (taskArgs, hre) => {
        const PRIVATE_KEY = taskArgs.privateKey || "";

        let signer;
        const [owner] = await hre.ethers.getSigners();
        
        if (PRIVATE_KEY) {
            signer = new hre.ethers.Wallet(PRIVATE_KEY, hre.ethers.provider);
        } else {
            signer = owner;
        }

        const signMessage = await signer.signMessage(taskArgs.challenge);

        console.log({
            signer: signer.address,
            signMessage
        });

    });
