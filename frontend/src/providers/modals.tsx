import { FC, createContext, useContext, useEffect, useState } from "react";
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

    return (
        <ModalsContext.Provider
            value={{
                chainModal,
                switchChainModal: setChainModal
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
