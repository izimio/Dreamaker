import { Context, Middleware } from "koa";
import { AuthError } from "../utils/error";
import { ethers } from "ethers";
import { DEPLOYER_PRIVATE_KEY } from "../utils/config";


export const AdminMiddleware = (
    ctx: Context,
    next: () => Promise<any>
) => {
    const ADMIN_ADDRESS = new ethers.Wallet(DEPLOYER_PRIVATE_KEY).address;

    if (ctx.state.address !== ADMIN_ADDRESS) {
        throw new AuthError("Unauthorized");
    }

    return next();
}