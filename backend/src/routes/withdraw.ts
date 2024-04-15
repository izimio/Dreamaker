import Router from "koa-router";
import { Context } from "koa";
import * as withdrawnController from "../controllers/withdraw";
import { AdminMiddleware } from "../middlewares/admin";
import { authMiddleware } from "../middlewares/auth";
const router: Router = new Router();

router.prefix("/withdraw");

router.post("/", authMiddleware, AdminMiddleware, withdrawnController.withdraw);
router.get("/", authMiddleware, AdminMiddleware, withdrawnController.getBalance);

export default router;
