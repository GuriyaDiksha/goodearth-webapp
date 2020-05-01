import Koa from "koa";
import { getHistory } from "routerHistory/index";

export default async function attachReduxStore(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  const history = getHistory(false, ctx.url);
  ctx.history = history;
  await next();
}
