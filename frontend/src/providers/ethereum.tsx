import { FC, createContext, useContext, useEffect, useState } from "react";
import { getState, removeState } from "../utils/storage";
import { DEFAULT_CHAINS } from "../ethereum/config";
import { changeChain, getChainId } from "../ethereum/metamask";
import { useModals } from "./modals";

interface IEthereum {
    chainId: number | null;
}

interface Props {
    children: JSX.Element;
}

const EthereumContext = createContext({} as IEthereum);

export const EthereumProvider: FC<Props> = ({ children }) => {
    const [chainId, setChainId] = useState<number | null>(null);

    const { switchChainModal } = useModals();

    useEffect(() => {
        if (!chainId) return;
    
        if (!DEFAULT_CHAINS.includes(chainId)) {
            switchChainModal(true);
        } else {
            switchChainModal(false);
        }
    }, [chainId]);

    useEffect(() => {
        if (!chainId) {
            const handleChainIdRetrieved = async () => {
                const chainId = await getChainId();
                console.log(chainId);
                if (!DEFAULT_CHAINS.includes(chainId)) {
                    changeChain(DEFAULT_CHAINS[0]);
                }
                setChainId(chainId);
            };
            handleChainIdRetrieved();
        }
        const handleChainChanged = (chainId: any) => {
            const pchainId = parseInt(chainId, 16);
            if (!DEFAULT_CHAINS.includes(pchainId)) {
                changeChain(DEFAULT_CHAINS[0]);
            }
            setChainId(pchainId);
        };

        window.ethereum.on("chainChanged", handleChainChanged);

        return () => {
            window.ethereum.removeListener("chainChanged", handleChainChanged);
        };
    }, []);

    return (
        <EthereumContext.Provider
            value={{
                chainId,
            }}
        >
            {children}
        </EthereumContext.Provider>
    );
};

export const useEthereum = () => {
    return useContext(EthereumContext);
};
