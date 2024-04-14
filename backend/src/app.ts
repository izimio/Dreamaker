// defaults imports
import http from "http";
import Koa, { Context } from "koa";
import cors from "@koa/cors";
import Router from "koa-router";
import bodyParser from "koa-body";
import mongoose from "mongoose";
import { logger, logError } from "./utils/logger";

import { Watcher } from "./Watchers/Watch";
import { SyncronInstance } from "./syncron/Syncron";
// Routers
import versionRouter from "./routes/version";
import dreamRouter from "./routes/dream";
import authRouter from "./routes/auth";
import withdrawRouter from "./routes/withdraw"

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

const log = logger.extend("app");
const logErr = logError.extend("app");

const app: Koa = new Koa();
const serverKoa = http.createServer(app.callback());

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

function useRoute(app: Koa, router: Router) {
    app.use(router.routes());
    app.use(router.allowedMethods());
}

mongoose.set("strictQuery", false);
mongoose
    .connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_INITDB_DATABASE}`, {
        autoCreate: true,
        user: MONGO_USER,
        pass: MONGO_PASSWORD,
    })
    .then((e) => {
        log("🌱 MongoDB connected");

        if (IS_TEST_MODE) {
            log("🧪 Test mode enabled");
            return;
        }
        Watcher.watch();
        SyncronInstance.start();
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

export default serverKoa;
