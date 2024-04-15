import { Context } from "koa";
import * as dreamServices from "../services/dream";
import {
    parseFormData,
    validateEditDream,
    validateNewDream,
    validateObjectId,
} from "../utils/validator";
import { ValidationError } from "yup";

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
    const id = await dreamServices.postDream(
        ctx.state.address,
        title,
        tags,
        description,
        deadlineTime,
        targetAmount,
        files || []
    );

    const txHash = await dreamServices.createDreamOnChain(
        ctx.state.address,
        targetAmount,
        deadlineTime
    );

    ctx.body = {
        ok: true,
        data: {
            txHash,
            dream: {
                id,
                title,
                description,
                tags,
                deadlineTime,
                targetAmount: targetAmount.toString(),
                minFundingAmount: "1",
                files,
            },
        },
    };
    ctx.status = 201;
};

export const getDreams = async (ctx: Context) => {
    if (ctx.query.id) {
        await validateObjectId.validate(ctx.query);
    }
    const dreams = await dreamServices.getDreams(ctx.query);
    ctx.body = {
        ok: true,
        data: {
            dreams,
        },
    };
};

export const getMyDreams = async (ctx: Context) => {
    if (ctx.query.id) {
        await validateObjectId.validate(ctx.query);
    }
    const dreams = await dreamServices.getDreams({
        ...ctx.query,
        owner: ctx.state.address,
    });
    ctx.body = {
        ok: true,
        data: {
            dreams,
        },
    };
};

export const updateDream = async (ctx: Context) => {
    const { id } = await validateObjectId.validate(ctx.params);
    const edits = await validateEditDream.validate(ctx.request.body);
    const me = ctx.state.address;

    if (!Object.keys(edits).length) {
        throw new ValidationError("No editions provided");
    }

    const ndream = await dreamServices.updateDream(id, me, edits);

    ctx.body = {
        ok: true,
        data: {
            dream: ndream,
        },
    };
};
