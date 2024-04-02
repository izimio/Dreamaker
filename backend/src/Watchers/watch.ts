import { ethers } from "ethers";
import { DREAM_PROXY_FACTORY_ADDRESS } from "../utils/config";
import { provider } from "../utils/Sdk";

interface IEvent {
    name: string,
    signature: string,
    contract: string
}

const events: IEvent[] = [
    {
        name: "ProxyCreated",
        signature: "ProxyCreated(address,address)",
        contract: DREAM_PROXY_FACTORY_ADDRESS
    },
    {
        name: "ReceivedFees",
        signature: "ReceivedFees(address,uint256)",
        contract: DREAM_PROXY_FACTORY_ADDRESS
    },
    {
        name: "DreamFunded",
        signature: "DreamFunded(address,uint256)",
        contract: ""
    },
    {
        name: "DreamRefunded",
        signature: "DreamRefunded(address,uint256)",
        contract: ""
    },
    {
        name: "MinFundingAmountChanged",
        signature: "MinFundingAmountChanged(uint256)",
        contract: ""
    }
]

class EventWatcher {


    buildFilter(contractAddress: string, eventName: string) {
        return {
            address: contractAddress,
            topics: [
                ethers.id(eventName)
            ]
        }
    }

    parseLogs(event: string, data: string) {

        const Interface = new ethers.Interface([
            `event ${event}`
        ])
        const decoded = Interface.decodeEventLog(event, data)
        return decoded
    }

    async addWatcher(contract: string, signature: string, name: string) {
        const filter = this.buildFilter(contract, signature)

        const listeners = await provider.listenerCount(filter)
        if (listeners != 0) {
            return;
        }

        provider.on(filter, async (event) => {
            const decoded = this.parseLogs(signature, event.data)
            await this.handleEvents(name, decoded);
        })
    }

    async removeWatcher(contract: string, signature: string) {
        const filter = this.buildFilter(contract, signature)

        const listeners = await provider.listenerCount(filter)
        if (listeners > 0) {
            provider.off(filter)
        }
    }

    async removeAllWatchers() {
        provider.removeAllListeners()
    }

    async watch() {
        for (const event of events) {
            if (event.contract) {
                await this.addWatcher(event.contract, event.signature, event.name)
            }
        }
        console.log("Watchers started")
    }


    async handleEvents(name: string, args: any[]) {
        switch (name) {
            case "ProxyCreated":
                await this.addWatcher(args[0], events[2].signature, events[2].name)
                break;
            case "ReceivedFees":
                break;
            case "DreamFunded":
                break;
            case "DreamRefunded":
                break;
            case "MinFundingAmountChanged":
                break;
        }
        console.log("Event Handled: ", name)
    }
}

export const Watcher = new EventWatcher();