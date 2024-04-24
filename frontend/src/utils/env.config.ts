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
