import { N, ethers } from "ethers";
import { provider, ABIs, Contract, signer } from "../utils/EProviders";
import { logger, logError } from "../utils/logger";
import { DreamModel, DreamStatus } from "../models/dreamModel";
import { IEvent, events } from "./config";
import { BASE_MINING_DREAMAKER, DREAMAKER_ADDRESS } from "../utils/config";

const log = logger.extend("ws");
const logErr = logError.extend("ws");

class EventWatcher {
    proxyEvents: IEvent[];

    constructor() {
        this.proxyEvents = Object.values(events).filter(
            (event) => !event.contract
        );
    }

    buildFilter(contractAddress: string, eventName: string) {
        return {
            address: contractAddress,
            topics: [ethers.id(eventName)],
        };
    }

    calcOfferedDreamer(amounts: BigInt[]): BigInt[] {
        const numberAmounts = amounts.map((amount) => Number(amount));
        const total = numberAmounts.reduce((acc, curr) => acc + curr, 0);

        const retribution = numberAmounts.map((amount) => {
            const percentage = amount / total;
            return BigInt(
                Math.ceil(percentage * Number(BASE_MINING_DREAMAKER))
            );
        });

        return retribution;
    }

    parseLogs(event: string, data: string) {
        const Interface = new ethers.Interface([`event ${event}`]);
        const decoded = Interface.decodeEventLog(event, data);
        return decoded;
    }

    async addWatcher(contract: string, signature: string, name: string) {
        const filter = this.buildFilter(contract, signature);

        const listeners = await provider.listenerCount(filter);
        if (listeners != 0) {
            return;
        }

        provider.on(filter, async (event) => {
            const decoded = this.parseLogs(signature, event.data);
            const origin = event.address;

            await this.handleEvents(name, origin, decoded);
        });

        log("🟢", name);
    }

    async removeWatcher(contract: string, signature: string, name: string) {
        const filter = this.buildFilter(contract, signature);

        const listeners = await provider.listenerCount(filter);
        if (listeners > 0) {
            provider.off(filter);
        }

        log("🔴", name);
    }

    async removeAllWatchers() {
        log("Removing all watchers:");
        provider.removeAllListeners();
    }

    async manageProxyWatcher(proxy: string, addWatcher: boolean) {
        log("➡️ ", proxy);

        for (const event of this.proxyEvents) {
            if (addWatcher) {
                await this.addWatcher(proxy, event.signature, event.name);
            } else {
                await this.removeWatcher(proxy, event.signature, event.name);
            }
        }
    }

    async watch() {
        for (const event of Object.values(events)) {
            if (event.contract) {
                await this.addWatcher(
                    event.contract,
                    event.signature,
                    event.name
                );
            }
        }

        const proxies = await DreamModel.find({ status: { $eq: "active" } });
        for (const proxy of proxies) {
            await this.manageProxyWatcher(proxy.proxyAddress, true);
        }
        log("🚀 Watchers started");
    }

    async handleProxyCreated(args: any[], event: IEvent) {
        const [proxy, owner] = args;

        await this.manageProxyWatcher(proxy, true);

        const dream = await DreamModel.updateOne(
            { owner: owner, proxyAddress: null },
            { proxyAddress: proxy, status: DreamStatus.ACTIVE }
        );
        if (!dream || dream.matchedCount === 0) {
            logErr("Dream not found: ", owner);
        }
    }

    async handleReceivedFees(args: any[], event: IEvent) {
        const [proxy, amount] = args;

        const dream = await DreamModel.findOne({ proxyAddress: proxy });

        if (!dream) {
            logErr("Dream not found: ", proxy);
            return;
        }

        if (dream.status !== DreamStatus.ACTIVE) {
            logErr("Dream is not active: ", proxy);
            return;
        }

        await this.manageProxyWatcher(proxy, false);

        const proxyContract = new ethers.Contract(proxy, ABIs.Dream, provider);
        const DreamakerToken = new ethers.Contract(
            DREAMAKER_ADDRESS,
            ABIs.Dreamaker,
            signer
        );

        const funders = [];
        const amounts = [];

        try {
            const fa = await proxyContract.getFundersAndAmounts();
            funders.push(...fa[0]);
            amounts.push(...fa[1]);
        } catch (error) {
            logErr("Failed to get funders and amounts: ", error);
            return;
        }

        const offeredAmounts = this.calcOfferedDreamer(amounts);
        try {
            await DreamakerToken.offer(funders, offeredAmounts);
        } catch (error) {
            logErr("Failed to offer dreamaker: ", error);
            return;
        }

        dream.status = DreamStatus.REACHED;
        await dream.save();
    }

    async handleDreamFunded(origin: string, args: any[], event: IEvent) {
        const [funder, amount] = args;

        const dream = await DreamModel.findOne({ proxyAddress: origin });
        if (!dream) {
            logErr("Dream not found: ", origin);
            return;
        }

        const funderIndex = dream.funders.findIndex(
            (f) => f.address === funder
        );
        if (funderIndex !== -1) {
            dream.funders[funderIndex].amount += amount;
        } else {
            dream.funders.push({ address: funder, amount });
        }

        await dream.save();
    }

    async handleDreamRefunded(origin: string, args: any[], event: IEvent) {
        // DO the mongo thing
    }

    async handleMinFundingAmountChanged(
        origin: string,
        args: any[],
        event: IEvent
    ) {
        const [amount] = args;

        const dream = await DreamModel.updateOne(
            { proxyAddress: origin },
            { minFundingAmount: amount }
        );
        if (!dream || dream.matchedCount === 0) {
            logErr("Dream not found: ", origin);
        }
    }

    handleUnknownEvent(name: string) {
        logErr("Unknown event: ", name);
    }

    async handleEvents(name: string, origin: string, args: any[]) {
        const event = events[name];

        if (!event) {
            logErr("❗Event not supported:", name);
            return;
        } else log("✔️  [", name, "] received");

        switch (name) {
            case "ProxyCreated":
                await this.handleProxyCreated(args, event);
                break;
            case "ReceivedFees":
                await this.handleReceivedFees(args, event);
                break;
            case "DreamFunded":
                await this.handleDreamFunded(origin, args, event);
                break;
            case "DreamRefunded":
                await this.handleDreamRefunded(origin, args, event);
                break;
            case "MinFundingAmountChanged":
                await this.handleMinFundingAmountChanged(origin, args, event);
                break;
            default:
                this.handleUnknownEvent(name);
        }
        console.log("");
    }
}

export const Watcher = new EventWatcher();
