import { Context } from "koa";
import * as dreamServices from "../services/dream";
import { parseFormData, validateNewDream } from "../utils/validator";

export const createDream = async (ctx: Context) => {
    const ctxFiles = (ctx.request.files as { [key: string]: any }) || {};
    const parsedFormData = {
        ...parseFormData(ctx.request.body),
        files:
            Object.values(ctxFiles).map((file: any) => ({
                mimetype: file.mimetype,
                filepath: file.filepath,
                newFilename: file.newFilename,
            })) || [],
    };
    const {
        title,
        description,
        deadlineTime,
        targetAmount,
        files,
    } = await validateNewDream.validate(parsedFormData);

    // database call
    await dreamServices.postDream(
        ctx.state.address,
        title,
        description,
        deadlineTime,
        targetAmount as bigint,
        files || []
    );

    const txHash = await dreamServices.createDreamOnChain(ctx.state.address, targetAmount as bigint, deadlineTime);

    ctx.body = {
        ok: true,
        data : {
            txHash,
        }
    };
};

export const getDreams = async (ctx: Context) => {
    const dreams = await dreamServices.getDreams();
    ctx.body = {
        ok: true,
        data: {
            dreams,
        }
    };
};