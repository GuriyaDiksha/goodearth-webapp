import { configureStore } from "store/configure";
import Koa from "koa";

export default async function reduxStore(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  const history = ctx.history;
  const store = configureStore(false, history);
  ctx.store = store;
  await next();
}
