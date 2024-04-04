import Router from 'koa-router';
import { Context } from 'koa';

import { authMiddleware } from '../middlewares/auth';
import * as dreamCotroller from "../controllers/dream";

const router: Router = new Router();

router.prefix('/dream');

router.post('/new', authMiddleware, dreamCotroller.createDream);

export default router;
