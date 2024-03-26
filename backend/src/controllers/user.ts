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

export const setLogin = async (ctx: Context) => {
  const { email, password } = await validateLogUser().validate(
    ctx.request.body
  );
  const user = await userServices.setLogin(email, password);
  ctx.body = {
    user: {
      username: user.username,
      email: user.email,
    },
    ok: true,
  };
  ctx.status = 200;
};