import { Context, Middleware } from "koa";
import { AuthError } from "../utils/error";


export const AdminMiddleware = (): Middleware => {
    return async (ctx: Context, next: () => Promise<any>) => {
        if (ctx.state.address !== process.env.ADMIN_ADDRESS) {
            throw new AuthError("Unauthorized");
        }
        await next();
    };
}