import Koa from "koa";
import { updateCookies } from "actions/cookies";
// import API from "utils/api";

export default async function cookies(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  const token = ctx.cookies.get("atkn");

  ctx.customCookies = {
    tkn: token
  };

  if (token) {
    const store = ctx.store;

    store.dispatch(
      updateCookies({
        tkn: token
      })
    );
  }
  await next();
}
