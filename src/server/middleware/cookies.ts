import Koa from "koa";
import { updateCookies } from "actions/cookies";
import { updateCurrency } from "actions/currency";
import { AppState } from "reducers/typings";
import { updatePlpMobileView } from "actions/plp";
import { updateShowCookie } from "actions/info";

export default async function cookies(
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  next: Koa.Next
) {
  // Retrieve values from cookies and the Koa context
  const token = ctx.cookies.get("atkn");
  const sessionId = ctx.cookies.get("sessionid");
  const currency: any = ctx.cookies.get("currency");
  const plpMobileView = ctx.cookies.get("plpMobileView");
  const store = ctx.store;
  const agent = ctx.request.get("user-agent");

  // Check if the user agent indicates a bot
  const isBot = /bot|googlebot|crawler|spider|robot|curl|crawling/i.test(agent);

  // Get the application state
  const state: AppState = ctx.store.getState();
  const storeCurrency = state.currency;

  // Extract URL information
  const { pathname } = ctx.history.location;
  const isBridalBasket = ctx.cookies.get("isBridal");
  // const queryString = search;
  // const urlParams = new URLSearchParams(queryString);
  // const boId = urlParams.get("bo_id");

  // Update the PLP (Product List Page) mobile view based on cookies
  if (plpMobileView && (plpMobileView == "list" || plpMobileView == "grid")) {
    if (state.device.tablet) {
      store.dispatch(updatePlpMobileView("grid"));
    } else {
      store.dispatch(updatePlpMobileView(plpMobileView));
    }
  }

  // Update the 'showCookie' state based on cookies
  const showCookie = ctx.cookies.get("goodearth");
  if (showCookie != "show") {
    store.dispatch(updateShowCookie(true));
  }

  // Check conditions and dispatch actions if necessary
  if (
    !currency &&
    (!isBridalBasket || isBridalBasket == "no") &&
    // !boId &&
    !pathname.includes("/order/orderconfirmation/") &&
    !pathname.includes("/registry/") &&
    !isBot
  ) {
    // Dispatch actions if certain conditions are met
    // dispatch(updateComponent(POPUP.CURRENCY, null, true));
    // dispatch(updateModal(true));
  }

  // Set custom cookies in the Koa context
  ctx.customCookies = {
    tkn: token,
    sessionid: sessionId
  };

  // Update the currency state based on cookies
  if (["INR", "USD", "GBP", "AED", "SGD"].indexOf(currency) > -1) {
    store.dispatch(updateCurrency(currency));
  } else if (!storeCurrency) {
    store.dispatch(updateCurrency("INR"));
  }

  // Update cookies and dispatch actions if token and/or sessionId exist
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

  // Continue to the next middleware
  await next();
}
