import Cron from "node-cron";
import { cronWorker } from "./worker";
import { logger } from "../utils/logger";

const CRON_EVERY_HOUR = "0 * * * *";
const CRON_EVERY_15_SECONDS = "*/15 * * * * *";

const log = logger.extend("syncron");

class Syncron {
    private cronInstance: Cron.ScheduledTask | null = null;

    public cronString: string = CRON_EVERY_HOUR;

    private isStarted = false;

    constructor(cronString: string = CRON_EVERY_15_SECONDS) {
        this.cronString = cronString;
    }

    stop() {
        if (!this.isStarted) {
            return;
        }
        log("⛔ Stopping cron worker");
        this.cronInstance?.stop();
    }

    start() {
        if (this.isStarted) {
            return;
        }
        log("👷 Starting cron worker");
        this.isStarted = true;
        this.cronInstance = Cron.schedule(this.cronString, () => {
            log("====> ⏰ Running cron worker <====");
            cronWorker();
        });
    }
}

export const SyncronInstance = new Syncron();
