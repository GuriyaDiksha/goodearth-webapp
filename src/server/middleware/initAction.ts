import Koa from "koa";
import initAction from "actions/initAction";
import { Store } from "redux";
import ApiService from "services/api";

export default async function fetchInitialData(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  const store: Store = ctx.store;
  const isBridalPublicPage =
    ctx.request.path.includes("/bridal/") &&
    !ctx.request.path.includes("/account/");
  let bridalKey = "";
  if (isBridalPublicPage) {
    const pathArray = ctx.request.path.split("/");
    bridalKey = pathArray[pathArray.length - 1];
  }
  await ApiService.getSalesStatus(store.dispatch, bridalKey).catch(err => {
    console.log("Sales Api Status ==== " + err);
  });
  await initAction(ctx, ctx.history);
  await next();
}
