import axios from "axios";
import { API_URL } from "../utils/env.config";

const ToolsApi = axios.create({
    baseURL: API_URL + "/tools",
});

export const getProxyFactoryBalance = async () => {
    try {
        const res = await ToolsApi.get("/factory-balance");
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
