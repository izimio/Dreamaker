import { ethers } from "ethers";
import { provider, ABIs, signer } from "../utils/EProviders";
import { logger, logError } from "../utils/logger";
import { DreamModel, DreamStatus } from "../models/dreamModel";
import { IEvent, events } from "./config";
import {
    BASE_MINING_DREAMAKER_PERCENTAGE,
    DREAMAKER_ADDRESS,
    BASE_BOOST_DURATION,
} from "../utils/config";
import { UserAction, UserModel } from "../models/userModel";

const log = logger.extend("ws");
const logErr = logError.extend("ws");

class EventWatcher {
    proxyEvents: IEvent[];
    isReady: boolean = false;

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

    calcOfferedDreamer(amounts: bigint[]): bigint[] {
        const numberAmounts = amounts.map((amount) => Number(amount));

        return numberAmounts.map((amount) =>
            BigInt(amount * (Number(BASE_MINING_DREAMAKER_PERCENTAGE) / 100))
        );
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

            this.handleEvents(name, origin, decoded);
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

    async watch(errors: number = 0) {
        if (this.isReady) {
            log("Watcher already started");
            return;
        }

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
        this.isReady = true;
    }

    async stop() {
        await this.removeAllWatchers();
        log("🛑 Watchers stopped");
    }

    async handleProxyCreated(args: any[], _: IEvent) {
        const [proxy, owner] = args;

        await this.manageProxyWatcher(proxy, true);

        const dream = await DreamModel.findOneAndUpdate(
            { owner: owner.toLowerCase(), proxyAddress: null },
            { proxyAddress: proxy, status: DreamStatus.ACTIVE },
            { new: true }
        );
        if (!dream) {
            logErr("[HPC] Dream not found or already linked to a SC: ", owner);
            return;
        }

        await UserModel.updateOne(
            { address: { $regex: new RegExp(owner, "i") } }, // Case-insensitive match
            {
                $push: {
                    actionHistory: {
                        dreamId: dream._id,
                        action: UserAction.CREATE,
                        date: new Date(),
                    },
                },
            }
        );
    }

    async handleReceivedFees(args: any[], _: IEvent) {
        const [proxy] = args;

        const dream = await DreamModel.findOne({ proxyAddress: proxy });

        if (!dream) {
            logErr("[HRF] Dream not found: ", proxy);
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
            logErr("[HRF] Failed to get funders and amounts: ", error);
            return;
        }

        const offeredAmounts = this.calcOfferedDreamer(amounts);
        try {
            await DreamakerToken.offer(funders, offeredAmounts);
        } catch (error) {
            logErr("[HRF] Failed to offer dreamaker: ", error);
            return;
        }

        dream.status = DreamStatus.WITHDRAWN;
        await dream.save();
    }

    async handleDreamFunded(origin: string, args: any[], _: IEvent) {
        const [funder, amount] = args;

        const dream = await DreamModel.findOne({ proxyAddress: origin });
        if (!dream) {
            logErr("[HDF] Dream not found: ", origin);
            return;
        }

        const stringifiedAmount: string = amount.toString();
        const funderIndex = dream.funders.findIndex(
            (f) => f.address === funder
        );
        if (funderIndex !== -1) {
            const alreadyFunded = BigInt(dream.funders[funderIndex].amount);
            const res = BigInt(stringifiedAmount) + alreadyFunded;
            dream.funders[funderIndex].amount = res.toString();
        } else {
            dream.funders.push({
                address: funder,
                amount: stringifiedAmount,
                refund: false,
            });
        }
        dream.fundingGraph.push({
            date: new Date(),
            amount: amount.toString(),
            funder,
        });

        const stringifyAmount: string = amount.toString();

        await UserModel.updateOne(
            { address: { $regex: new RegExp(funder, "i") } }, // Case-insensitive match
            {
                $push: {
                    actionHistory: {
                        dreamId: dream._id,
                        action: UserAction.FUND,
                        amount: stringifyAmount,
                        date: new Date(),
                    },
                },
            }
        );

        await dream.save();
    }

    async handleDreamRefunded(origin: string, args: any[], event: IEvent) {
        const [funder, amount] = args;

        const dream = await DreamModel.findOne({ proxyAddress: origin });
        if (!dream) {
            logErr("[HDR] Dream not found: ", origin);
            return;
        }

        const funderIndex = dream.funders.findIndex(
            (f) => f.address === funder
        );
        if (funderIndex === -1) {
            logErr("[HDR] Funder not found: ", funder);
            return;
        }

        dream.funders[funderIndex].refund = true;

        const stringifyAmount: string = amount.toString();

        await UserModel.updateOne(
            { address: { $regex: new RegExp(funder, "i") } }, // Case-insensitive match
            {
                $push: {
                    actionHistory: {
                        dreamId: dream._id,
                        action: UserAction.REFUND,
                        amount: stringifyAmount,
                        date: new Date(),
                    },
                },
            }
        );

        await dream.save();
    }

    async handleDreamBoosted(origin: string, args: any[], _: IEvent) {
        const [booster, proxy, amount] = args;
        const now = new Date();

        const dream = await DreamModel.findOne({ proxyAddress: proxy });
        if (!dream) {
            logErr("[HDB] Dream not found: ", proxy);
            return;
        }

        const startingDate =
            new Date(dream.boostedUntil) > now ? dream.boostedUntil : now;
        const nbOfDmk = Number(ethers.formatEther(amount.toString()));

        const endOfBoost = new Date(
            new Date(startingDate).getTime() +
                Math.ceil(Number(BASE_BOOST_DURATION) * nbOfDmk)
        );
        const result = await DreamModel.findOneAndUpdate(
            { proxyAddress: proxy },
            { boostedUntil: endOfBoost.toISOString() },
            { new: true }
        );
        if (!result) {
            logErr("[HDB] Dream not found: ", proxy);
            return;
        }

        const stringifyAmount: string = amount.toString();
        await UserModel.updateOne(
            { address: { $regex: new RegExp(booster, "i") } }, // Case-insensitive match
            {
                $push: {
                    actionHistory: {
                        dreamId: dream._id,
                        action: UserAction.BOOST,
                        amount: stringifyAmount,
                        date: now,
                    },
                },
            }
        );
    }

    async handleMinFundingAmountChanged(
        origin: string,
        args: any[],
        _: IEvent
    ) {
        const [amount] = args;

        const dream = await DreamModel.updateOne(
            { proxyAddress: origin },
            { minFundingAmount: amount }
        );
        if (!dream || dream.matchedCount === 0) {
            logErr("[HMFA] Dream not found: ", origin);
        }
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
            case "DreamBoosted":
                await this.handleDreamBoosted(origin, args, event);
                break;
            default:
                logErr("Unknown event: ", name);
        }
    }
}

export const Watcher = new EventWatcher();
