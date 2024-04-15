import { Context } from "koa";

import * as withdrawService from "../services/withdraw";
import { validateWithdraw } from "../utils/validator";

export const withdraw = async (ctx: Context) => {
    const { amount, to } = await validateWithdraw.validate(ctx.request.body);

    const res = await withdrawService.withdraw(to, amount);

    ctx.body = {
        ok: true,
        data: {
            status: res.status,
            amount: res.amount,
            to: to,
        },
    };
    ctx.status = 200;
};

export const getBalance = async (ctx: Context) => {
    const balance = await withdrawService.getBalance();

    ctx.body = {
        ok: true,
        data: {
            balance: balance,
        },
    };
    ctx.status = 200;
};
