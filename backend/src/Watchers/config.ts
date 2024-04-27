import {
    DREAMAKER_ADDRESS,
    DREAM_PROXY_FACTORY_ADDRESS,
} from "../utils/config";

export interface IEvent {
    name: string;
    signature: string;
    contract: string;
}

export const events: { [index: string]: IEvent } = {
    ProxyCreated: {
        name: "ProxyCreated",
        signature: "ProxyCreated(address,address)",
        contract: DREAM_PROXY_FACTORY_ADDRESS,
    },
    ReceivedFees: {
        name: "ReceivedFees",
        signature: "ReceivedFees(address,uint256)",
        contract: DREAM_PROXY_FACTORY_ADDRESS,
    },
    DreamFunded: {
        name: "DreamFunded",
        signature: "DreamFunded(address,uint256)",
        contract: "",
    },
    DreamRefunded: {
        name: "DreamRefunded",
        signature: "DreamRefunded(address,uint256)",
        contract: "",
    },
    MinFundingAmountChanged: {
        name: "MinFundingAmountChanged",
        signature: "MinFundingAmountChanged(uint256)",
        contract: "",
    },
    DreamBoosted: {
        name: "DreamBoosted",
        signature: "DreamBoosted(address,address,uint256)",
        contract: DREAMAKER_ADDRESS,
    },
};
