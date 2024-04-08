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
        minFundingAmount,
        files,
    } = await validateNewDream.validate(parsedFormData);

    ctx.state.user = {
        address: "0x1234567890123456789012345678901234567890",
    };
    await dreamServices.postDream(
        ctx.state.user.address,
        title,
        description,
        deadlineTime,
        targetAmount as bigint,
        minFundingAmount as bigint,
        files || []
    );
    ctx.body = {
        message: "Dream created",
    };
};
