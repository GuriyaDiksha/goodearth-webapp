// services
import HeaderService from "services/headerFooter";
import ApiService from "services/api";
import MetaService from "services/meta";
import Koa from "koa";
// typings
import { Store } from "redux";
import { AppState } from "reducers/typings";
import Api from "services/api";
import { MetaResponse } from "services/meta/typings";
// import BasketService from "services/basket";

const initAction: any = async (
  ctx: Koa.ParameterizedContext<Koa.DefaultContext>,
  history: any
) => {
  const store: Store = ctx.store;
  const state: AppState = ctx.store.getState();
  const currency = state.currency || "INR";
  const isBridalPublicPage =
    history.location.pathname.includes("/bridal/") &&
    !history.location.pathname.includes("/account/");
  let bridalKey = "";
  // const basketPage = history.location.pathname.includes("checkout")
  //   ? "checkout"
  //   : history.location.pathname.includes("cart")
  //   ? "cart"
  //   : undefined;
  if (isBridalPublicPage) {
    const pathArray = history.location.pathname.split("/");
    bridalKey = pathArray[pathArray.length - 1];
  }
  let apiCalls: Promise<void | MetaResponse | undefined>[] = [
    HeaderService.fetchHeaderDetails(store.dispatch, currency)
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log("HEADER API ERROR ==== " + err);
      }),
    HeaderService.fetchFooterDetails(store.dispatch)
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log("FOOTER API ERROR ==== " + err);
      }),
    Api.getAnnouncement(store.dispatch)
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log("FOOTER API ERROR ==== " + err);
      }),
    ApiService.getCurrency(store.dispatch, bridalKey).catch(err => {
      console.log("CURRENCY API ERROR ==== " + err);
    }),

    ApiService.getPopupBgUrl(store.dispatch).catch(err => {
      console.log("Popup Bg Api Status ==== " + err);
    })
  ];

  if (state.cookies.tkn) {
    apiCalls = apiCalls.concat([
      MetaService.updateMeta(store.dispatch, state.cookies, bridalKey).catch(
        err => {
          console.log("META API ERROR ==== " + err);
        }
      )
      // BasketService.fetchBasket(store.dispatch, basketPage).then(res => {
      //   console.log(res);
      // })
    ]);
  }
  return Promise.all(apiCalls);
};
export default initAction;
