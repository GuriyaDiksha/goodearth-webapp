import Koa from "koa";
import initAction from "actions/initAction";
import { Store } from "redux";
import ApiService from "services/api";

export default async function fetchInitialData(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  const store: Store = ctx.store;
  await ApiService.getSalesStatus(store.dispatch).catch(err => {
    console.log("Sales Api Status ==== " + err);
  });
  await initAction(ctx, ctx.history);
  await next();
}
