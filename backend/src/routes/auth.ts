import Router from "koa-router";
import * as authCotroller from "../controllers/auth";

const router: Router = new Router();

router.prefix("/auth");

router.get("/challenge/:address", authCotroller.createEcRecoverChallenge);
router.post("/verify", authCotroller.verifyEcRecoverChallenge);

export default router;
