import { getChallenge, verifyChallenge } from "../api/auth";

export const connectWallet = async () => {

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length === 0) {
        return {
            ok: false,
            message: "No accounts found"
        }
    }

    const address = accounts[0];

    const data1 = await getChallenge(address);
    if (!data1.ok) {
        return {
            ok: false,
            message: data1.error
        }
    }

    const challenge = data1.data.challenge;

    const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [address, challenge]
    });

    // verify the signature
    const data2 = await verifyChallenge(address, challenge, signature);
    if (!data2.ok) {
        return {
            ok: false,
            message: data2.error
        }
    }
    return {
        ok: true,
        data: {
            address,
            token: data2.data.token
        }
    }
}
