import Router from "koa-router";
import { Context } from "koa";
import * as authCotroller from "../controllers/auth";

const router: Router = new Router();

router.prefix("/auth");

router.post("/challenge", authCotroller.createEcRecoverChallenge);
router.post("/verify", authCotroller.verifyEcRecoverChallenge);

export default router;
