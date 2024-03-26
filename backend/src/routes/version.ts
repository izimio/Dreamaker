import Router from "koa-router";
import { Context } from "koa";
const router: Router = new Router();

router.get("/version", async (ctx: Context) => {
  const version = "1.0";
  ctx.body = {
    ok: true,
    version,
    isAlive: true,
  };
  ctx.status = 200;
});

export default router;