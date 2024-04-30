// defaults imports
import http from "http";
import Koa, { Context } from "koa";
import cors from "@koa/cors";
import Router from "koa-router";
import bodyParser from "koa-body";
import mongoose from "mongoose";
import { logger, logError } from "./utils/logger";

// Watcher & Syncron
import { Watcher } from "./Watchers/Watch";
import { SyncronInstance } from "./syncron/Syncron";

// Routers
import versionRouter from "./routes/tools";
import dreamRouter from "./routes/dream";
import authRouter from "./routes/auth";
import withdrawRouter from "./routes/withdraw";
import userRouter from "./routes/user";

// Middleware & config
import { errorMiddleware } from "./middlewares/error";
import { RateLimiter } from "./middlewares/rateLimiter";
import {
    MONGO_INITDB_DATABASE,
    MONGO_HOST,
    MONGO_PORT,
    ALLOWED_ORIGINS,
    MONGO_USER,
    MONGO_PASSWORD,
    IS_TEST_MODE,
} from "./utils/config";
import { waitForProvider } from "./utils/EProviders";

const log = logger.extend("app");
const logErr = logError.extend("app");

const app: Koa = new Koa();
const serverKoa = http.createServer(app.callback());

function verifyOrigin(ctx: Context) {
    const allowedOrigins = ALLOWED_ORIGINS.split(",");
    const origin = ctx.headers.origin as string;
    if (!origin) {
        return "";
    }
    if (allowedOrigins.includes(origin)) {
        return origin;
    }
    return "";
}

// app runs behind a proxy handling TLS
app.proxy = true;

app.use(
    cors({
        origin: (ctx) => {
            const origin = verifyOrigin(ctx);
            return origin;
        },
        credentials: true,
    })
);

function useRoute(app: Koa, router: Router) {
    app.use(router.routes());
    app.use(router.allowedMethods());
}

const setupCrawlers = async () => {
    await waitForProvider();
    Watcher.watch();
    SyncronInstance.start();
};

mongoose.set("strictQuery", false);
mongoose
    .connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_INITDB_DATABASE}`, {
        autoCreate: true,
        user: MONGO_USER,
        pass: MONGO_PASSWORD,
    })
    .then((_) => {
        log("🌱 MongoDB connected");

        if (IS_TEST_MODE) {
            log("🧪 Test mode enabled");
            return;
        }
        setupCrawlers();
    })
    .catch((err) => {
        logErr("MongoDB Connection error, retrying...\n" + err);
    });

app.use(
    bodyParser({
        includeUnparsed: true,
    })
);

app.use(errorMiddleware);
app.use(RateLimiter());

useRoute(app, versionRouter);
useRoute(app, dreamRouter);
useRoute(app, authRouter);
useRoute(app, withdrawRouter);
useRoute(app, userRouter);

export default serverKoa;
