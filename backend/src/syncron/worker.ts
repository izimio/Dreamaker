import { ethers } from "ethers";
import { DreamModel, IDream } from "../models/dreamModel";
import { provider, ABIs } from "../utils/EProviders";
import { logger } from "../utils/logger";

const log = logger.extend("syncron:worker");

enum WorkerDreamStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    REACHED = "reached",
}

export const cronWorkerEach = async (
    dream: IDream
): Promise<WorkerDreamStatus> => {
    const proxyAddress = dream.proxyAddress;
    const targetAmount = ethers.parseUnits(dream.targetAmount, "wei");

    const dreamContract = new ethers.Contract(
        proxyAddress,
        ABIs.Dream,
        provider
    );

    let amount: bigint;
    try {
        amount = await dreamContract.getAmount();
    } catch (e) {
        log("Error in dream %s: %O", dream.proxyAddress);
        return WorkerDreamStatus.EXPIRED;
    }
    if (amount >= targetAmount) {
        return WorkerDreamStatus.REACHED;
    }

    return WorkerDreamStatus.EXPIRED;
};

export const cronWorker = async () => {
    const now = Math.floor(Date.now() / 1000);

    const dreams = await DreamModel.find({
        status: WorkerDreamStatus.ACTIVE,
    });

    const reached = [];
    const expired = [];

    for (const dream of dreams) {
        // If the dream is not endex yet, skip it
        if (now < dream.deadlineTime) {
            continue;
        }

        let status;
        try {
            status = await cronWorkerEach(dream);
        } catch (e) {
            log("Error in dream %s: %O", dream._id, e);
            continue;
        }
        if (status === WorkerDreamStatus.REACHED) {
            reached.push(dream._id);
        } else if (status === WorkerDreamStatus.EXPIRED) {
            expired.push(dream._id);
        }
    }

    log("reached: %O", reached);
    if (reached.length > 0) {
        await DreamModel.updateMany(
            { _id: { $in: reached } },
            { status: WorkerDreamStatus.REACHED }
        );
    }

    log("expired: %O", expired);
    if (expired.length > 0) {
        await DreamModel.updateMany(
            { _id: { $in: expired } },
            { status: WorkerDreamStatus.EXPIRED }
        );
    }
    log("Dream treated: %O", dreams.length);
};
