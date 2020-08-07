import Koa from "koa";
import { updateCookies } from "actions/cookies";
import { updateCurrency } from "actions/currency";
// import API from "utils/api";

export default async function cookies(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  const token = ctx.cookies.get("atkn");
  const currency: any = ctx.cookies.get("currency") || "INR";
  const sessionId = ctx.cookies.get("sessionid");
  const store = ctx.store;
  ctx.customCookies = {
    tkn: token,
    sessionid: sessionId
  };
  store.dispatch(updateCurrency(currency));
  if (token) {
    store.dispatch(
      updateCookies({
        tkn: token
      })
    );
  }
  if (sessionId) {
    store.dispatch(
      updateCookies({
        sessionid: sessionId
      })
    );
  }
  await next();
}
