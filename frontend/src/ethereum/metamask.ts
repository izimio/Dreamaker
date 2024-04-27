import { getChallenge, verifyChallenge } from "../api/auth";

export const getEthAccount = async () => {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length === 0) {
        return {
            ok: false,
            message: "No account found",
        };
    }
    return {
        ok: true,
        data: accounts[0],
    };
};

export const connectWallet = async () => {
    const { ok, data: address } = await getEthAccount();
    if (!ok) {
        return {
            ok: false,
            message: address.message,
        };
    }
    const data1 = await getChallenge(address);
    if (!data1.ok) {
        return {
            ok: false,
            message: data1.error,
        };
    }

    const challenge = data1.data.challenge;

    const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [address, challenge],
    });

    // verify the signature
    const data2 = await verifyChallenge(address, challenge, signature);
    if (!data2.ok) {
        return {
            ok: false,
            message: data2.error,
        };
    }
    return {
        ok: true,
        data: {
            address,
            token: data2.data.token,
        },
    };
};

export const changeChain = async (chainId: number) => {
    try {
        if (window.ethereum.isOpen === true) {
            return;
        }
        // if same request is alreadt sent don't send again
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
    } catch (error) {
        // console.error(error);
    }
};

export const getChainId = async () => {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    return parseInt(chainId, 16);
};

export const metamaskSendTransaction = async (
    fromAddress: string,
    toAddress: string,
    data: string,
    value?: string
) => {
    if (!window.ethereum) {
        return {
            ok: false,
            message: "Please install Metamask.",
        };
    }

    try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
        return {
            ok: false,
            message: "Please allow Metamask to connect.",
        };
    }

    let tx;
    try {
        tx = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [
                {
                    from: fromAddress,
                    to: toAddress,
                    data,
                    value,
                },
            ],
        });
    } catch (error) {
        return {
            ok: false,
            message: "Transaction failed.",
        };
    }
    return {
        ok: true,
        data: tx,
    };
};
