import {
    BLOCKCHAIN_RPC,
    DEPLOYER_PRIVATE_KEY,
    DREAMAKER_ADDRESS,
    DREAM_PROXY_FACTORY_ADDRESS,
} from "./config";
import { ethers } from "ethers";
import DreamArtifact from "../abis/DreamV1.sol/DreamV1.json";
import DreamakerArtifact from "../abis/Dreamaker.sol/Dreamaker.json";
import ProxyFactoryArtifact from "../abis/proxies/DreamProxyFactory.sol/DreamProxyFactory.json";
import { logger } from "./logger";

const log = logger.extend("providers");

const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_RPC);

const signer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);

const isProviderReady = async () => {
    try {
        await provider.getBlockNumber();
        return true;
    } catch (e) {
        return false;
    }
};

async function waitForProvider() {
    while (!(await isProviderReady())) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        log("Waiting for provider to be ready, retrying...");
    }
}

const ABIs = {
    Dream: DreamArtifact.abi,
    Dreamaker: DreamakerArtifact.abi,
    ProxyFactory: ProxyFactoryArtifact.abi,
};

const DreamProxyFactory = new ethers.Contract(
    DREAM_PROXY_FACTORY_ADDRESS,
    ABIs.ProxyFactory,
    signer
);
const DreamakerToken = new ethers.Contract(
    DREAMAKER_ADDRESS,
    ABIs.Dreamaker,
    signer
);

const Contract = {
    DreamProxyFactory,
    DreamakerToken,
};

export { provider, signer, ABIs, Contract, waitForProvider };
