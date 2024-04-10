import { Context } from "koa";
import * as dreamServices from "../services/dream";
import {
    parseFormData,
    validateEditDream,
    validateNewDream,
} from "../utils/validator";
import { ethers } from "ethers";

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
    const { title, description, deadlineTime, targetAmount, files, tags } =
        await validateNewDream.validate(parsedFormData);

    // database call
    await dreamServices.postDream(
        ctx.state.address,
        title,
        tags,
        description,
        deadlineTime,
        targetAmount as bigint,
        files || []
    );

    const txHash = await dreamServices.createDreamOnChain(
        ctx.state.address,
        targetAmount as bigint,
        deadlineTime
    );

    ctx.body = {
        ok: true,
        data: {
            txHash,
            dream: {
                title,
                description,
                deadlineTime,
                targetAmount,
                minFundingAmount: ethers.parseUnits("1", "wei"),
                files,
            },
        },
    };
};

export const getDreams = async (ctx: Context) => {
    const dreams = await dreamServices.getDreams();
    ctx.body = {
        ok: true,
        data: {
            dreams,
        },
    };
};

export const getMyDreams = async (ctx: Context) => {
    const dreams = await dreamServices.getDreams(ctx.state.address);
    ctx.body = {
        ok: true,
        data: {
            dreams,
        },
    };
};

export const updateDream = async (ctx: Context) => {
    const { id } = ctx.params;
    const edits = await validateEditDream.validate(ctx.request.body);

    await dreamServices.updateDream(id, edits);

    ctx.body = {
        ok: true,
    };
};
