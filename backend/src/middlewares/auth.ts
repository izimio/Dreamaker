import jwt from "jsonwebtoken";
import { Context, Middleware } from "koa";
import { AuthError } from "../utils/error";
import { JWT_SECRET } from "../utils/config";

export const authMiddleware = async (
    ctx: Context,
    next: () => Promise<Middleware>
) => {
    const token = ctx?.headers?.authorization?.split(" ")[1];
    if (!token) {
        throw new AuthError("No token provided");
    }
    let decodedToken = null;
    try {
        decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new AuthError("Token invalide");
    }
    if (!decodedToken) {
        throw new AuthError("Token invalide");
    }
    const { address } = decodedToken as { address: string };
    if (!address) {
        throw new AuthError("Token invalide");
    }
    ctx.state.address = address;
    return next();
};
