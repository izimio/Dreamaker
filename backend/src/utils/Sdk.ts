import { Alchemy, Network } from "alchemy-sdk";
import { ALCHEMY_API_KEY, BLOCKCHAIN_RPC, DEPLOYER_PRIVATE_KEY } from "./config";
import { ethers } from "ethers";

export const AlchemySDK = new Alchemy({
    apiKey: ALCHEMY_API_KEY,
    network: Network.ETH_SEPOLIA
});

export const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_RPC);

export const signer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);
