import Router from "koa-router";
import { Context } from "koa";
import * as withdrawnController from "../controllers/withdraw";
import { AdminMiddleware } from "../middlewares/admin";
const router: Router = new Router();

router.prefix("/withdraw");

router.get("/", AdminMiddleware, withdrawnController.withdraw);
router.get("/list", AdminMiddleware, withdrawnController.getWithdrawList);

export default router;
