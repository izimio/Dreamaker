import { API_URL } from "../utils/env.config";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: API_URL + "/auth"
});

export const getChallenge = async (address: string) => {
    try {
        const response = await axiosInstance.get(`/challenge/${address}`);
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
}