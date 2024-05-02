import { ethers } from "ethers";
import DreamArtifact from "../abis/DreamV1.sol/DreamV1.json";
import DreamakerArtifact from "../abis/Dreamaker.sol/Dreamaker.json";
import ProxyFactoryArtifact from "../abis/proxies/DreamProxyFactory.sol/DreamProxyFactory.json";
import {
    DREAMAKER_ADDRESS,
    DREAM_PROXY_FACTORY_ADDRESS,
} from "../utils/env.config";
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
        const res = await metamaskSendTransaction({
            fromAddress,
            toAddress: DREAMAKER_ADDRESS,
            data: DREAMAKER_INTERFACE.encodeFunctionData("boost", [
                proxyAddress,
                numberofDMK,
            ]),
            value: "0x0",
        });
        return res;
    } catch (error) {
        return {
            ok: false,
            message: "Transaction failed.",
        };
    }
};

export const fund = async (
    fromAddress: string,
    proxyAddress: string,
    amount: bigint
) => {
    try {
        const res = await metamaskSendTransaction({
            fromAddress,
            toAddress: proxyAddress,
            data: DREAM_INTERFACE.encodeFunctionData("fund"),
            value: ethers.toBeHex(amount),
        });
        return res;
    } catch (error) {
        return {
            ok: false,
            message: "Transaction failed.",
        };
    }
};

export const refund = async (fromAddress: string, proxyAddress: string) => {
    try {
        const res = await metamaskSendTransaction({
            fromAddress,
            toAddress: proxyAddress,
            data: DREAM_INTERFACE.encodeFunctionData("refund"),
            value: "0x0",
        });
        return res;
    } catch (error) {
        return {
            ok: false,
            message: "Transaction failed.",
        };
    }
};

export const withdraw = async (fromAddress: string, proxyAddress: string) => {
    try {
        const res = await metamaskSendTransaction({
            fromAddress,
            toAddress: proxyAddress,
            data: DREAM_INTERFACE.encodeFunctionData("withdraw"),
            value: "0x0",
        });
        return res;
    } catch (error) {
        return {
            ok: false,
            message: "Transaction failed.",
        };
    }
};

export const changeMinFundingAmount = async (
    fromAddress: string,
    proxyAddress: string,
    newAmount: bigint
) => {
    try {
        const res = await metamaskSendTransaction({
            fromAddress,
            toAddress: proxyAddress,
            data: DREAM_INTERFACE.encodeFunctionData("setMinFundingAmount", [
                newAmount,
            ]),
            value: "0x0",
        });
        return res;
    } catch (error) {
        return {
            ok: false,
            message: "Transaction failed.",
        };
    }
};

export const withdrawFactory = async (
    fromAddress: string,
    amount: bigint,
    beneficiary: string
) => {
    try {
        const res = await metamaskSendTransaction({
            fromAddress,
            toAddress: DREAM_PROXY_FACTORY_ADDRESS,
            data: PROXY_FACTORY_INTERFACE.encodeFunctionData("withdraw", [
                amount,
                beneficiary,
            ]),
            value: "0x0",
        });
        return res;
    } catch (error) {
        return {
            ok: false,
            message: "Transaction failed.",
        };
    }
};
