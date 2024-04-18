import { FC, createContext, useContext, useEffect, useState } from "react";
import ChainModal from "../Modals/ChainModal";
import ChallengeModal from "../Modals/ChallengeModal";

interface IModals {
    chainModal: boolean;
    switchChainModal: (state: boolean) => void;
    challengeModal: boolean;
    switchChallengeModal: (state: boolean) => void;
}

interface Props {
    children: JSX.Element;
}

const ModalsContext = createContext({} as IModals);

export const ModalsProviders: FC<Props> = ({ children }) => {

    const [chainModal, setChainModal] = useState<boolean>(false);
    const [challengeModal, setChallengeModal] = useState<boolean>(false);

    return (
        <ModalsContext.Provider
            value={{
                challengeModal,
                chainModal,
                switchChallengeModal: setChallengeModal,
                switchChainModal: setChainModal
            }}
        >
            <>
                <ChallengeModal />
                <ChainModal />
                {children}
            </>
        </ModalsContext.Provider>
    );
};

export const useModals = () => {
    return useContext(ModalsContext);
};
