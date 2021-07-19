import Koa from "koa";
import { updateCookies } from "actions/cookies";
import { updateCurrency } from "actions/currency";
import { AppState } from "reducers/typings";
import { updatePlpMobileView } from "actions/plp";
import { updateShowCookie } from "actions/info";
// import { updateComponent, updateModal } from "actions/modal";
// import { POPUP } from "../../constants/components";
// import API from "utils/api";

export default async function cookies(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  const token = ctx.cookies.get("atkn");
  const sessionId = ctx.cookies.get("sessionid");
  const currency: any = ctx.cookies.get("currency");
  const plpMobileView = ctx.cookies.get("plpMobileView");
  const store = ctx.store;
  const agent = ctx.request.get("user-agent");
  const isBot = /bot|googlebot|crawler|spider|robot|curl|crawling/i.test(agent);
  const state: AppState = ctx.store.getState();
  const storeCurrency = state.currency;
  // for currency popup
  // const dispatch = ctx.store.dispatch;
  const { pathname, search } = ctx.history.location;
  // const currencyPopup = ctx.cookies.get("currencypopup");
  const isBridalBasket = ctx.cookies.get("isBridal");
  const queryString = search;
  const urlParams = new URLSearchParams(queryString);
  const boId = urlParams.get("bo_id");

  if (plpMobileView && (plpMobileView == "list" || plpMobileView == "grid")) {
    store.dispatch(updatePlpMobileView(plpMobileView));
  }
  const showCookie = ctx.cookies.get("goodearth");
  if (showCookie != "show") {
    store.dispatch(updateShowCookie(true));
  }
  if (pathname != "/maintenance") {
    ctx.redirect("/maintenance");
  }
  if (
    !currency &&
    (!isBridalBasket || isBridalBasket == "no") &&
    !boId &&
    !pathname.includes("/order/orderconfirmation/") &&
    !pathname.includes("/bridal/") &&
    !isBot
  ) {
    // dispatch(updateComponent(POPUP.CURRENCY, null, true));
    // dispatch(updateModal(true));
  }
  ctx.customCookies = {
    tkn: token,
    sessionid: sessionId
  };
  if (["INR", "USD", "GBP"].indexOf(currency) > -1) {
    store.dispatch(updateCurrency(currency));
  } else if (!storeCurrency) {
    store.dispatch(updateCurrency("INR"));
  }

  if (token) {
    if (sessionId) {
      store.dispatch(
        updateCookies({
          tkn: token,
          sessionid: sessionId
        })
      );
    } else {
      store.dispatch(
        updateCookies({
          tkn: token
        })
      );
    }
  } else if (sessionId) {
    store.dispatch(
      updateCookies({
        sessionid: sessionId
      })
    );
  }
  await next();
}
