// defaults imports
import http from "http";
import Koa, { Context } from "koa";
import cors from "@koa/cors";
import Router from "koa-router";
import bodyParser from "koa-body";
import mongoose from "mongoose";
import { logger, logError } from "./utils/logger";

import { Watcher } from "./Watchers/Watch";
// Routers
import versionRouter from "./routes/version";
import dreamRouter from "./routes/dream";

// Middleware & config
import { errorMiddleware } from "./middlewares/error";
import { RateLimiter } from "./middlewares/rateLimiter";
import {
    MONGO_INITDB_DATABASE,
    MONGO_HOST,
    MONGO_PORT,
    ALLOWED_ORIGINS,
    MONGO_INITDB_ROOT_USERNAME,
    MONGO_INITDB_ROOT_PASSWORD,
} from "./utils/config";
import admin from "./firebase/Bucket";
import Bucket from "./firebase/Bucket";
import { ValidationError } from "yup";

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
    .connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/`, {
        autoCreate: true,
        user: MONGO_INITDB_ROOT_USERNAME,
        pass: MONGO_INITDB_ROOT_PASSWORD,
    })
    .then((e) => {
        log("🌱 MongoDB connected");
        console.log();
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

// Start watchers
// Watcher.watch();

export default serverKoa;
