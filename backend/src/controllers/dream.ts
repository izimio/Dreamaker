import { Context } from "koa";
import * as dreamServices from "../services/dream";
import { parseFormData, validateNewDream } from "../utils/validator";

export const createDream = async (ctx: Context) => {
    const files = (ctx.request.files as { [key: string]: any }) || {};
    const parsedFormData = parseFormData(ctx.request.body);
    console.log("Parsed form data:", parsedFormData);
    const { title, description, deadlineTime, targetAmount, minFundingAmount } = await validateNewDream.validate(parsedFormData);   

    console.log("Creating dream with title:", title, "description:", description, "deadlineTime:", deadlineTime, "targetAmount:", targetAmount, "minFundingAmount:", minFundingAmount);
    // await dreamServices.postDream();
    ctx.body = {
        message: "Dream created",
    };
};
