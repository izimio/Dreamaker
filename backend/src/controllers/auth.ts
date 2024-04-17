import { Context } from "koa";
import * as userServices from "../services/auth";
import {
    validateEthAddress,
    validateVerifyEcRecoverChallenge,
} from "../utils/validator";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config";

export const createEcRecoverChallenge = async (ctx: Context) => {
    const address = await validateEthAddress.validate(ctx.params.address);

    const challenge = await userServices.createEcRecoverChallenge(address);

    ctx.body = {
        ok: true,
        data: {
            challenge,
        },
    };
    ctx.status = 201;
};

export const verifyEcRecoverChallenge = async (ctx: Context) => {
    const { address, signature } =
        await validateVerifyEcRecoverChallenge.validate(ctx.request.body);

    await userServices.verifyEcRecoverChallenge(address, signature);

    const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: "1d" });

    ctx.body = {
        ok: true,
        data: {
            token,
        },
    };
    ctx.status = 200;
};
