import Router from "koa-router";
import { Context } from "koa";

import { authMiddleware } from "../middlewares/auth";
import * as dreamCotroller from "../controllers/dream";
import { filesMiddleware } from "../middlewares/files";

const router: Router = new Router();

router.prefix("/dream");

router.post("/", filesMiddleware, dreamCotroller.createDream);

export default router;
