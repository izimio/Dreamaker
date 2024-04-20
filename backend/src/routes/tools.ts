import Router from "koa-router";
import { Context } from "koa";
import { TAGS, LIMITS, ALLOWED_EXTENSIONS } from "../utils/constants";
const router: Router = new Router();

router.prefix("/tools");

router.get("/version", async (ctx: Context) => {
    const version = "1.0";
    ctx.body = {
        ok: true,
        version,
        isAlive: true,
    };
    ctx.status = 200;
});

router.get("/constants", async (ctx: Context) => {
    ctx.body = {
        ok: true,
        data: {
            tags: TAGS,
            limits: LIMITS,
            allowedExtensions: ALLOWED_EXTENSIONS,
        },
    }
    ctx.status = 200;
});


export default router;
