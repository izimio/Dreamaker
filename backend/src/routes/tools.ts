import Router from "koa-router";
import { Context } from "koa";
import { TAGS, LIMITS, ALLOWED_EXTENSIONS } from "../utils/constants";
import {
    BASE_MINING_DREAMAKER_PERCENTAGE,
    BASE_BOOST_DURATION,
    DREAM_PROXY_FACTORY_ADDRESS,
} from "../utils/config";
import { ABIs, provider } from "../utils/EProviders";
import { ethers } from "ethers";
import { InternalError } from "../utils/error";

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
            dreamBC: {
                boostDuration: BASE_BOOST_DURATION,
                baseMiningRewardPercentage: BASE_MINING_DREAMAKER_PERCENTAGE,
            },
        },
    };
    ctx.status = 200;
});

router.get("/factory-balance", async (ctx: Context) => {

    const proxyFactory = new ethers.Contract(
        DREAM_PROXY_FACTORY_ADDRESS,
        ABIs.ProxyFactory,
        provider
    );

    let balance = 0n

    try {
        balance = await proxyFactory.getBalance();
        console.log(balance.toString());
    } catch (e: any) {
        throw new InternalError("Failed to get factory balance: " + e.message);
    }

    ctx.body = {
        ok: true,
        data: {
            balance: balance.toString(),
        },
    };
    ctx.status = 200;
});

export default router;
