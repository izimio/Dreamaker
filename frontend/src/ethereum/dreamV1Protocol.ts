import { ethers } from "ethers";
import DreamArtifact from "../abis/DreamV1.sol/DreamV1.json";
import DreamakerArtifact from "../abis/Dreamaker.sol/Dreamaker.json";
import ProxyFactoryArtifact from "../abis/proxies/DreamProxyFactory.sol/DreamProxyFactory.json";
import { DREAMAKER_ADDRESS } from "../utils/env.config";
import { useGlobal } from "../providers/global";
import { metamaskSendTransaction } from "./metamask";

const ABIs = {
    Dream: DreamArtifact.abi,
    Dreamaker: DreamakerArtifact.abi,
    ProxyFactory: ProxyFactoryArtifact.abi,
};

const DREAMAKER_INTERFACE = new ethers.Interface(ABIs.Dreamaker);
const DREAM_INTERFACE = new ethers.Interface(ABIs.Dream);
const PROXY_FACTORY_INTERFACE = new ethers.Interface(ABIs.ProxyFactory);

export const boost = async (
    fromAddress: string,
    proxyAddress: string,
    numberofDMK: bigint
) => {
    try {
        const res = await metamaskSendTransaction(
            fromAddress,
            DREAMAKER_ADDRESS,
            DREAMAKER_INTERFACE.encodeFunctionData("boost", [
                proxyAddress,
                numberofDMK,
            ])
        );
        return res;
    } catch (error) {
        return {
            ok: false,
            message: "Transaction failed.",
        };
    }
};
