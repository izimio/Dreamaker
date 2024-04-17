import { FC, createContext, useContext, useEffect, useState } from "react";
import { getState, removeState } from "../utils/storage";
import { API_URL } from "../utils/env.config";
import axios from "axios";

type Dream = {};

type User = {
    address: string;
    DMK: number;
    dreams: Dream[];
};

interface IGlobal {
    dreams: Dream[];
    user: User | null;
    token: string | null;
    setDreams: (dreams: Dream[]) => void;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    logout: () => void;
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

    useEffect(() => {
        setToken(getState("token"));

        const initGlobalStates = async () => {
            const response = await axiosInstance.get("/dream");
            setDreams(response.data.data);

            if (!getState("token")) return;
            retrieveUser();
        };
        initGlobalStates();
    }, []);

    useEffect(() => {
        if (!getState("token")) return;
        retrieveUser();
    }, [token]);

    const retrieveUser = async () => {
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
        const response = await axiosInstance.get("/user/me");
        const data = response.data.data;
        setUser({
            address: data.address,
            DMK: data.numberOfDMK,
            dreams: data.dreams || [],
        });
    };
    const logout = () => {
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
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => {
    return useContext(GlobalContext);
};
