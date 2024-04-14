import { Context } from "koa";

import * as withdrawService from "../services/withdraw";

export const withdraw = async (ctx: Context) => {
};

export const getWithdrawList = async (ctx: Context) => {

    const dreams = await withdrawService.getWithdrawList();

    ctx.body = {
        ok: true,
        data: {
            dreams: dreams,
            numberOfDreams: dreams.length
        }
    }
};