import { Context } from "koa";
import { validateCreateUser, validateLogUser } from "../utils/validator";
import * as userServices from "../services/user";

export const createUser = async (ctx: Context) => {
  const { username, email, password } = await validateCreateUser().validate(
    ctx.request.body
  );
  await userServices.createUser(username, email, password);
  ctx.body = {
    ok: true,
  };
  ctx.status = 201;
};
