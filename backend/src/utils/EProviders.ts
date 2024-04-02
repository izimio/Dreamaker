import { BLOCKCHAIN_RPC, DEPLOYER_PRIVATE_KEY } from './config';
import { ethers } from 'ethers';

export const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_RPC);

export const signer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);
