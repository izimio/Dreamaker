import Router from "koa-router";
import { filesMiddleware } from "../middlewares/files";
import { authMiddleware } from "../middlewares/auth";

import * as dreamCotroller from "../controllers/dream";

const router: Router = new Router();

router.prefix("/dream");

router.post("/", authMiddleware, filesMiddleware, dreamCotroller.createDream);

router.put("/:id", authMiddleware, dreamCotroller.updateDream);

router.get("/", dreamCotroller.getDreams);
router.get("/me", authMiddleware, dreamCotroller.getMyDreams);

export default router;
