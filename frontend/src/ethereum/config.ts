import { IS_DEV, SEPOLIA_RPC } from "../utils/env.config";
export const LOCAL_NODE_CONFIG = {
    name: "Localhost",
    currency: "ETH",
    rpcUrl: "http://localhost:8545",
    chainId: 1337,
};

export const SEPOLIA_NODE_CONFIG = {
    name: "Sepolia",
    currency: "ETH",
    rpcUrl: SEPOLIA_RPC,
    chainId: 11155111,
};

export const DEFAULT_NODE_CONFIG = IS_DEV ? LOCAL_NODE_CONFIG : SEPOLIA_NODE_CONFIG;