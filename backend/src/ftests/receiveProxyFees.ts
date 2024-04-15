import axios from "axios";
import { ethers } from "ethers";
import dotenv from "dotenv";
import DreamArtifact from "../abis/DreamV1.sol/DreamV1.json";



dotenv.config();

const API_URL = "http://localhost:8080";
const RPC_URL = "http://localhost:8545";

const main = async () => {
    const PK = process.env.DEPLOYER_PRIVATE_KEY as string;
    if (!PK) {
        console.error("Private key is required");
        return;
    }
    const Signer = new ethers.Wallet(PK, new ethers.JsonRpcProvider(RPC_URL));

    const PROXY_ADDRESS = process.argv[2] || "";
    if (!PROXY_ADDRESS) {
        console.error("Proxy address is required");
        return;
    }

    const CloneContract = new ethers.Contract(PROXY_ADDRESS, DreamArtifact.abi, Signer);

    try {
        const tx = await CloneContract.withdraw();
        await tx.wait();
    } catch (e) {
        console.error("Failed to withdraw", e);
    }

    console.log("Withdrawn,");

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });