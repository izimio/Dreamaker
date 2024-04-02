// defaults imports
import http from "http";
import Koa, { Context } from "koa";
import cors from "@koa/cors";
import Router from "koa-router";
import bodyParser from "koa-body";
import mongoose from "mongoose";
import { logger, logError } from "./utils/logger";

import { Watchers } from "./Watchers/watch";
// Routers
import versionRouter from "./routes/version";

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
  }),
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
  })
  .then(() => {
    log("MongoDB connected :D");
  })
  .catch((err) => {
    log("MongoDB Connection error, retrying...\n" + err);
  });

app.use(
  bodyParser({
    includeUnparsed: true,
  }),
);

app.use(errorMiddleware);
app.use(RateLimiter());

useRoute(app, versionRouter);

// Start watchers
Watchers();

export default serverKoa;