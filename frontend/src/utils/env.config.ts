export const IS_DEV = import.meta.env.VITE_IS_DEV === "false" ? false : true;

export const API_URL = import.meta.env.VITE_API_URL as string;
if (!API_URL) {
    throw new Error("API_URL is not provided");
}

export const SEPOLIA_RPC = import.meta.env.VITE_SEPOLIA_RPC as string;
if (!SEPOLIA_RPC) {
    throw new Error("SEPOLIA_RPC is not provided");
}

export const FILLER_IDS = [
    "791AFE27366c8AD8F04481ebBD72b37948Cc52d2",
    "90C1AFE27366c8AD8F04481ebBD72b37948Cc52d2",
];

export const DREAMAKER_ADDRESS = import.meta.env
    .VITE_DREAMAKER_ADDRESS as string;
if (!DREAMAKER_ADDRESS) {
    throw new Error("DREAMAKER_ADDRESS is not provided");
}

export const DREAM_PROXY_FACTORY_ADDRESS = import.meta.env
    .VITE_DREAM_PROXY_FACTORY_ADDRESS as string;
if (!DREAM_PROXY_FACTORY_ADDRESS) {
    throw new Error("DREAM_PROXY_FACTORY_ADDRESS is not provided");
}

export const DREAM_SINGLETON_ADDRESS = import.meta.env
    .VITE_DREAM_SINGLETON_ADDRESS as string;
if (!DREAM_SINGLETON_ADDRESS) {
    throw new Error("DREAM_SINGLETON_ADDRESS is not provided");
}
