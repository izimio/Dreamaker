import axios from "axios";
import { API_URL } from "../utils/env.config";
import { ethers } from "ethers";
import { getState } from "../utils/storage";

const dreamApi = axios.create({
    baseURL: API_URL + "/dream",
});

const parsePriceToWei = (price: {
    amount: string;
    currency: "ETH" | "GWEI" | "WEI";
}) => {
    const priceUnit =
        price.currency === "ETH" ? "ether" : price.currency.toLowerCase();
    const eth = ethers.parseUnits(price.amount, priceUnit);
    return eth.toString();
};

const parseDateInSeconds = (date: Date) => {
    return Math.ceil(date.getTime() / 1000).toString();
};

export const createAPIDream = async (
    name: string,
    description: string,
    tags: string[],
    price: { amount: string; currency: "ETH" | "GWEI" | "WEI" },
    date: Date,
    files: File[]
) => {
    const token = getState("token");
    if (!token) {
        return {
            ok: false,
            data: "No token found",
        };
    }

    const formData = new FormData();

    const pTags = tags.join(",");
    const weiPrice = parsePriceToWei(price);
    const pDate = parseDateInSeconds(date);

    formData.append("title", name);
    formData.append("description", description);
    formData.append("tags", pTags);
    formData.append("targetAmount", weiPrice);
    formData.append("deadlineTime", pDate);

    files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
    });

    try {
        const res = await dreamApi.post("/", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data", // Ensure correct Content-Type header
            },
        });
        return {
            ok: true,
            data: res.data.data,
        };
    } catch (e: any) {
        return {
            ok: false,
            data: e.response.data.message,
        };
    }
};
