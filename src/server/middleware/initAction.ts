import Koa from "koa";
import initAction from "actions/initAction";

export default async function fetchInitialData(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  const store = ctx.store;
  await initAction(store, ctx.history);
  await next();
}
