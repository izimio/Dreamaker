import { Context } from "koa";

import * as userService from "../services/user";

export const getMyFunds = async (ctx: Context) => {
    const { amountFunded, fundedDreams } = await userService.getMyFunds(
        ctx.state.address
    );

    ctx.body = {
        ok: true,
        data: {
            fundedDreams,
            amountFunded,
        },
    };
};

export const getMe = async (ctx: Context) => {
    const meInfos = await userService.getMe(ctx.state.address);

    ctx.body = {
        ok: true,
        data: {
            isAdmin: meInfos.isAdmin,
            numberOfDMK: meInfos.numberOfDMK,
            address: ctx.state.address,
            actionHistory: meInfos.actionHistory,
            creation: meInfos.creation,
        },
    };
};
