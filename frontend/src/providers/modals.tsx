import { FC, createContext, useContext, useEffect, useState } from "react";
import { getState, removeState } from "../utils/storage";
import { DEFAULT_CHAINS } from "../ethereum/config";
import { changeChain } from "../ethereum/metamask";
import ChainModal from "../Modals/ChainModal";

interface IModals {
    chainModal: boolean;
    switchChainModal: (state: boolean) => void;

}

interface Props {
    children: JSX.Element;
}

const ModalsContext = createContext({} as IModals);

export const ModalsProviders: FC<Props> = ({ children }) => {

    const [chainModal, setChainModal] = useState<boolean>(false);

    const switchChainModal = (state: boolean) => {
        setChainModal(state);
    }

    return (
        <ModalsContext.Provider
            value={{
                chainModal,
                switchChainModal,
            }}
        >
            <>
                <ChainModal />
                {children}
            </>
        </ModalsContext.Provider>
    );
};

export const useModals = () => {
    return useContext(ModalsContext);
};
