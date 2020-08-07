import Koa from "koa";
import { updateCookies } from "actions/cookies";
import { updateCurrency } from "actions/currency";
// import API from "utils/api";

export default async function cookies(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  const token = ctx.cookies.get("atkn");
  const sessionId = ctx.cookies.get("sessionid");
  const currency: any = ctx.cookies.get("currency");
  const store = ctx.store;

  ctx.customCookies = {
    tkn: token,
    sessionid: sessionId
  };
  if (["INR", "USD", "GBP"].indexOf(currency) > -1) {
    store.dispatch(updateCurrency(currency));
  } else {
    store.dispatch(updateCurrency("INR"));
  }

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
