import { FC, createContext, useContext, useEffect, useState } from "react";
import { getState, removeState } from "../utils/storage";
import { API_URL } from "../utils/env.config";
import axios from "axios";
import Loading from "../pages/Loading";
import toast from "react-hot-toast";

type Dream = {};

type User = {
    address: string;
    DMK: number;
    dreams: Dream[];
};

type limits = {
    min: number;
    max: number;
};

type constants = {
    tags: string[];
    limits: {
        dreamTitle: limits;
        dreamDescription: limits;
        dreamTags: limits;
        files: limits;
    };
    allowedExtensions: string[];
};

interface IGlobal {
    dreams: Dream[];
    user: User | null;
    token: string | null;
    setDreams: (dreams: Dream[]) => void;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    logout: () => void;
    constants: constants;
}

interface Props {
    children: JSX.Element;
}

const axiosInstance = axios.create({
    baseURL: API_URL,
});

const GlobalContext = createContext({} as IGlobal);

export const GlobalProvider: FC<Props> = ({ children }) => {
    const [dreams, setDreams] = useState<Dream[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [constants, setConstants] = useState<constants>({
        tags: [],
        limits: {
            dreamTitle: { min: 0, max: 0 },
            dreamDescription: { min: 0, max: 0 },
            dreamTags: { min: 0, max: 0 },
            files: { min: 0, max: 0 },
        },
        allowedExtensions: [],
    });

    useEffect(() => {
        const initGlobalStates = async () => {
            const token = getState("token");
            const response = await axiosInstance.get("/dream");

            setToken(token);
            setDreams(response.data.data);

            const constantsResponse =
                await axiosInstance.get("/tools/constants");
            setConstants({
                tags: constantsResponse.data.data.tags,
                limits: constantsResponse.data.data.limits,
                allowedExtensions:
                    constantsResponse.data.data.allowedExtensions.map((ext: string) =>
                        ext.split("/")[1]
                    ),
            })
            if (!token) {
                return;
            }
        };
        initGlobalStates();
    }, []);

    useEffect(() => {
        if (!token) {
            return;
        }
        if (user && user.address) {
            return;
        }
        retrieveUser();
    }, [token, user]);

    const retrieveUser = async () => {
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
        let response;
        try {
            response = await axiosInstance.get("/user/me");
        } catch (error: any) {
            if (error.response.status === 401) {
                logout();
            }
            return;
        }
        const data = response.data.data;
        setUser({
            address: data.address,
            DMK: data.numberOfDMK,
            dreams: data.dreams || [],
        });
    };

    const logout = () => {
        toast.success("Logged out successfully");
        removeState("token");
        setToken(null);
        setUser(null);
    };

    return (
        <GlobalContext.Provider
            value={{
                dreams,
                user,
                token,
                setDreams,
                setUser,
                setToken,
                logout,
                constants,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => {
    return useContext(GlobalContext);
};
