import 

export const connectWallet = async () => {

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    console.log("accounts", accounts);
}
