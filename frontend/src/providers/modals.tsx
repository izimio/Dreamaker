import { FC, createContext, useContext, useState } from "react";
import ChainModal from "../Modals/ChainModal";
import ChallengeModal from "../Modals/ChallengeModal";
import AccountChangedModal from "../Modals/AccountChangedModal";
import PictureModal from "../Modals/PictureModal";

interface IModals {
    chainModal: boolean;
    switchChainModal: (state: boolean) => void;
    challengeModal: boolean;
    switchChallengeModal: (state: boolean) => void;
    accountChangedModal: boolean;
    switchAccountChangedModal: (state: boolean) => void;
    pictureModal: string;
    switchPictureModal: (state: string) => void;
}

interface Props {
    children: JSX.Element;
}

const ModalsContext = createContext({} as IModals);

export const ModalsProviders: FC<Props> = ({ children }) => {
    const [chainModal, setChainModal] = useState<boolean>(false);
    const [challengeModal, setChallengeModal] = useState<boolean>(false);
    const [accountChangedModal, setAccountChangedModal] =
        useState<boolean>(false);
    const [pictureModal, setPictureModal] = useState<string>("");
    return (
        <ModalsContext.Provider
            value={{
                challengeModal,
                chainModal,
                switchChallengeModal: setChallengeModal,
                switchChainModal: setChainModal,
                accountChangedModal,
                switchAccountChangedModal: setAccountChangedModal,
                pictureModal,
                switchPictureModal: setPictureModal,
            }}
        >
            <>
                <PictureModal />
                <AccountChangedModal />
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
