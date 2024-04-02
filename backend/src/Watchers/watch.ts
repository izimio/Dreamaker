import { Utils } from "alchemy-sdk";
import { AlchemySDK, provider } from "../utils/Sdk";
import { DREAM_SINGLETON_ADDRESS, DREAM_PROXY_FACTORY_ADDRESS, DREAMAKER_ADDRESS } from "../utils/config";
import { logger } from "../utils/logger";
import { ethers } from "ethers";
const log = logger.extend("ws");

const PROXY_CREATION_EVENT = "ProxyCreated(address,address)"
const DREAM_FUNDED_EVENT = "DreamFunded(address,uint256)"
const DREAM_WITHDRAWN_EVENT = "DreamWithdrawn(address,uint256,uint256)"
const DREAM_REFUNDED_EVENT = "DreamRefunded(address,uint256)"
const MIN_FUNDING_AMOUNT_CHANGED_EVENT = "MinFundingAmountChanged(uint256)"
const RECEIVED_FEES_EVENT = "ReceivedFees(address,uint256)"


const buildFilter = (contractAddress: string, eventName: string) => {
    return {
        address: contractAddress,
        topics: [
            Utils.id(eventName)
        ]
    }
}

const handleEvent = (event: string, data: string) => {

    const Interface = new ethers.Interface([
        `event ${event}`
    ])
    const decoded = Interface.decodeEventLog(event, data)
    return decoded
}

const watchProxyCreation = () => {
    log("Watching Proxy Creation")

    const filter = buildFilter(DREAM_PROXY_FACTORY_ADDRESS, PROXY_CREATION_EVENT)

    // AlchemySDK.ws.on(filter, (log, event) => {
    //     console.log("Proxy created", event, log)
    // })
        provider.on(filter, (event) => {
            const a = handleEvent(PROXY_CREATION_EVENT, event.data)
            console.log("Proxy created", a)
    })

}

export const Watchers = () => {
    watchProxyCreation()
}