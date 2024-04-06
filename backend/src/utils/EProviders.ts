import { BLOCKCHAIN_RPC, DEPLOYER_PRIVATE_KEY, DREAMAKER_ADDRESS, DREAM_PROXY_FACTORY_ADDRESS } from './config';
import { ethers } from 'ethers';
import DreamArtifact from "../abis/DreamV1.sol/DreamV1.json";
import DreamakerArtifact from "../abis/Dreamaker.sol/Dreamaker.json";
import ProxyFactoryArtifact from "../abis/proxies/DreamProxyFactory.sol/DreamProxyFactory.json";


const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_RPC)

const signer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);

const ABIs = {
    Dream: DreamArtifact.abi,
    Dreamaker: DreamakerArtifact.abi,
    ProxyFactory: ProxyFactoryArtifact.abi
};

const DreamProxyFactory = new ethers.Contract(DREAM_PROXY_FACTORY_ADDRESS, ABIs.ProxyFactory, signer);
const DreamakerToken = new ethers.Contract(DREAMAKER_ADDRESS, ABIs.Dreamaker, signer);

const Contract = {
    DreamProxyFactory,
    DreamakerToken
};

export {
    provider,
    signer,
    ABIs,
    Contract
};
