import Router from "koa-router";
import * as userController from "../controllers/user";
import { authMiddleware } from "../middlewares/auth";

const router: Router = new Router();

router.prefix("/user");

router.get("/me", authMiddleware, userController.getMe);
router.get("/me/funded", authMiddleware, userController.getMyFunds);

export default router;
