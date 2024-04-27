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

    const createdDream = await dreamServices.postDream(
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
            dream: createdDream,
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

    const parsedDream = {
        ...ndream,
        funders: ndream.funders.map((funder) => {
            return {
                ...funder,
                amount: funder.amount.toString(),
            };
        }),
        currentAmount: ndream.funders
            .reduce((acc: bigint, funder) => acc + BigInt(funder.amount), 0n)
            .toString(),
    };

    ctx.body = {
        ok: true,
        data: {
            dream: parsedDream,
        },
    };
};

export const likeDream = async (ctx: Context) => {
    const { id } = await validateObjectId.validate(ctx.params);
    const me = ctx.state.address;

    const res = await dreamServices.likeDream(id, me);

    ctx.body = {
        ok: true,
        data: {
            id: res.id,
            message: res.likeStatus ? "Dream liked" : "Dream unliked",
        },
    };
};
