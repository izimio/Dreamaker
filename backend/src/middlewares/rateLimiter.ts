import { Context, Middleware } from "koa";
import koaRateLimit from "koa-ratelimit";
import {
    APP_WHITELIST,
    APP_BLACKLIST,
    APP_MAX_REQUESTS,
    APP_WINDOW_SECONDS,
} from "../utils/config";

export const RateLimiter = (): Middleware => {
    return koaRateLimit({
        driver: "memory",
        db: new Map(),
        duration: parseInt(APP_WINDOW_SECONDS) * 1000,
        max: parseInt(APP_MAX_REQUESTS),
        whitelist: (ctx: Context) => {
            return APP_WHITELIST.split(",").includes(ctx.ip);
        },
        blacklist: (ctx: Context) => {
            return APP_BLACKLIST.split(",").includes(ctx.ip);
        },
        errorMessage: "Too many requests, please try again later.",
        id: (ctx: Context) => ctx.ip,
        headers: {
            remaining: "Rate-Limit-Remaining",
            reset: "Rate-Limit-Reset",
            total: "Rate-Limit-Total",
        },
    });
};
