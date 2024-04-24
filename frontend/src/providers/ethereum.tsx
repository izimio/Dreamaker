import { FC, createContext, useContext, useEffect, useState } from "react";
import { getState, removeState, setState } from "../utils/storage";
import { DEFAULT_CHAINS } from "../ethereum/config";
import { changeChain, connectWallet, getChainId } from "../ethereum/metamask";
import { useModals } from "./modals";
import toast from "react-hot-toast";
import { getETH_USDTPrice } from "../api/external";
import { useGlobal } from "./global";
import ChallengeModal from "../Modals/ChallengeModal";

interface IEthereum {
    chainId: number | null;
    ethPrice: number;
}

interface Props {
    children: JSX.Element;
}

const EthereumContext = createContext({} as IEthereum);

export const EthereumProvider: FC<Props> = ({ children }) => {
    const [chainId, setChainId] = useState<number | null>(null);
    const [ethPrice, setEthPrice] = useState<number>(0);
    const {
        switchChainModal,
        switchAccountChangedModal,
        switchChallengeModal,
    } = useModals();
    const { setToken, user } = useGlobal();

    useEffect(() => {
        if (!chainId) return;

        if (!DEFAULT_CHAINS.includes(chainId)) {
            switchChainModal(true);
        } else {
            switchChainModal(false);
        }
    }, [chainId, switchChainModal]);

    useEffect(() => {
        const fetchEthPrice = async () => {
            let ethPriceLS = getState("ethPrice");

            if (ethPriceLS) {
                if (new Date().getTime() > ethPriceLS.date + 1000 * 60) {
                    ethPriceLS = null;
                    removeState("ethPrice");
                } else {
                    setEthPrice(ethPriceLS.ethPrice);
                }
            }

            if (!ethPriceLS) {
                const res = await getETH_USDTPrice();
                setEthPrice(res);
                setState("ethPrice", {
                    ethPrice: res,
                    date: new Date().getTime(),
                });
            }
        };
        const initAccounts = async () => {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            if (!accounts.length) {
                toast.error("No account found");
            }
        };
        if (!chainId) {
            const handleChainIdRetrieved = async () => {
                const chainId = await getChainId();
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

        const handleAccountsChanged = (accounts: any) => {
            if (!accounts.length) {
                toast.error("No account found");
            }
            if (accounts[0] === user?.address) {
                return;
            }
            const rightModal = user?.address
                ? switchAccountChangedModal
                : switchChallengeModal;
            rightModal(true);
            try {
                connectWallet().then((e) => {
                    if (!e.ok || !e.data) {
                        toast.error(e.message);
                        return;
                    }
                    setState("token", e.data.token);
                    setToken(e.data.token);
                    rightModal(false);
                    toast.success(
                        user?.address ? "Account changed" : "Wallet connected"
                    );
                });
            } catch (error) {
                toast.error("Transaction rejected");
            }
        };
        initAccounts();
        fetchEthPrice();
        window.ethereum.on("chainChanged", handleChainChanged);
        window.ethereum.on("accountsChanged", handleAccountsChanged);

        return () => {
            window.ethereum.removeListener("chainChanged", handleChainChanged);
            window.ethereum.removeListener(
                "accountsChanged",
                handleAccountsChanged
            );
        };
    }, [chainId]);

    return (
        <EthereumContext.Provider
            value={{
                chainId,
                ethPrice,
            }}
        >
            {children}
        </EthereumContext.Provider>
    );
};

export const useEthereum = () => {
    return useContext(EthereumContext);
};
