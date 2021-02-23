import Koa from "koa";
import initAction from "actions/initAction";

export default async function fetchInitialData(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  await initAction(ctx, ctx.history);
  await next();
}
