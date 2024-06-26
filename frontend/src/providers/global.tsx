import { FC, createContext, useContext, useEffect, useState } from "react";
import { getState, removeState } from "../utils/storage";
import { API_URL } from "../utils/env.config";
import axios from "axios";
import toast from "react-hot-toast";

export const IDreamStatus = {
    ACTIVE: "active",
    REACHED: "reached",
    PENDING: "pending_validation",
    WITHDRAWN: "withdrawn",
    EXPIRED: "expired",
};

export type IDream = {
    _id: string;
    createdAt: string;
    title: string;
    description: string;
    assets: {
        link: string;
        type: string;
    }[];
    tags: string[];
    owner: string;
    status: string;
    deadlineTime: number;
    targetAmount: string;
    currentAmount: string;
    proxyAddress: string;
    minFundingAmount: string;
    funders: {
        address: string;
        amount: string;
        refund: boolean;
    }[];
    boostedUntil: string;
    likers: string[];
    fundingGraph: {
        date: string;
        amount: string;
        totalAmount: string;
        funder: string;
    }[];
};

type IUser = {
    address: string;
    DMK: number;
    isAdmin: boolean;
    actionHistory: {
        dreamId: string;
        action: string;
        amount: string;
        date: string;
    }[];
    creation: string;
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
    dreamBC: {
        boostDuration: number;
        baseMiningRewardPercentage: number;
    };
};

export type IDreamsTypesObj = {
    hotDreams: IDream[];
    boostedDreams: IDream[];
    myDreams: IDream[];
    allDreams: IDream[];
};
interface IGlobal {
    dreams: IDreamsTypesObj;
    user: IUser | null;
    token: string | null;
    setDreams: (dreams: IDreamsTypesObj) => void;
    setUser: (user: IUser) => void;
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
    const [dreams, setDreams] = useState<IDreamsTypesObj>({
        hotDreams: [],
        boostedDreams: [],
        myDreams: [],
        allDreams: [],
    });
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<IUser | null>(null);
    const [constants, setConstants] = useState<constants>({
        tags: [],
        limits: {
            dreamTitle: { min: 0, max: 0 },
            dreamDescription: { min: 0, max: 0 },
            dreamTags: { min: 0, max: 0 },
            files: { min: 0, max: 0 },
        },
        allowedExtensions: [],
        dreamBC: {
            boostDuration: 0,
            baseMiningRewardPercentage: 0,
        },
    });

    const sortDreamsNRetrieve = (dreams: IDream[]) => {
        const now = new Date();
        const hotDreams = dreams.filter((dr) => {
            const deadline = new Date(dr.deadlineTime * 1000);
            // if less than 24 hours
            return (
                deadline.getTime() - now.getTime() < 24 * 60 * 60 * 1000 &&
                dr.status === "active"
            );
        });
        const boostedDreams = dreams.filter(
            (dr) =>
                new Date(dr.boostedUntil).getTime() > Date.now() &&
                dr.status === "active"
        );
        const myDreams = dreams.filter(
            (dr) => dr.owner.toLowerCase() === user?.address.toLowerCase()
        );
        setDreams({
            hotDreams,
            boostedDreams,
            myDreams,
            allDreams: dreams,
        });
    };
    useEffect(() => {
        const initGlobalStates = async () => {
            const token = getState("token");
            const response = await axiosInstance.get("/dream");
            const dreamsList = response.data.data.dreams;

            setToken(token);
            sortDreamsNRetrieve(dreamsList);

            const constantsResponse =
                await axiosInstance.get("/tools/constants");
            setConstants({
                tags: constantsResponse.data.data.tags,
                limits: constantsResponse.data.data.limits,
                allowedExtensions:
                    constantsResponse.data.data.allowedExtensions.map(
                        (ext: string) => ext.split("/")[1]
                    ),
                dreamBC: constantsResponse.data.data.dreamBC,
            });
            if (!token) {
                return;
            }
        };
        initGlobalStates();
    }, []);

    useEffect(() => {
        sortDreamsNRetrieve(dreams.allDreams);
    }, [dreams.allDreams]);

    useEffect(() => {
        if (!token) {
            return;
        }
        retrieveUser();
    }, [token]);

    const retrieveUser = async () => {
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
        let response;
        try {
            response = await axiosInstance.get("/user/me");
        } catch (error: any) {
            if (
                error.response.status === 401 ||
                error.response.status === 404
            ) {
                logout();
            }
            return;
        }
        const data = response.data.data;
        console.log(data);
        setUser({
            address: data.address,
            DMK: data.numberOfDMK,
            actionHistory: data.actionHistory,
            isAdmin: data.isAdmin || false,
            creation: data.creation,
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
