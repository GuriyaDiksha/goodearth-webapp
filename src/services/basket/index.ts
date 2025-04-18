import { Dispatch } from "redux";
// typings
import { Basket } from "typings/basket";
// actions
import { updateBasket } from "actions/basket";
// utils
import API from "utils/api";
import { ProductID } from "typings/id";
import { MESSAGE } from "constants/messages";
import { showGrowlMessage } from "../../utils/validate";
import { updateCheckoutLoader, updateLoader } from "actions/info";

export default {
  fetchBasket: async function(
    dispatch: Dispatch,
    source?: string,
    history?: any,
    isLoggedIn?: boolean
  ) {
    // let boId: any = "";
    // if (typeof document != "undefined") {
    // const queryString = location.search;
    // const urlParams = new URLSearchParams(queryString);
    // boId = urlParams.get("bo_id");
    // }
    const res = await API.get<Basket>(
      dispatch,
      `${__API_HOST__}/myapi/basket/detail${source ? "?source=" + source : ""}`
    );
    if (
      (res.updated || res.publishRemove) &&
      res.updatedRemovedItems &&
      res.updatedRemovedItems.length > 0
    ) {
      showGrowlMessage(
        dispatch,
        MESSAGE.PRODUCT_UNPUBLISHED,
        0,
        undefined,
        res.updatedRemovedItems
      );
    }
    if (res.unshippableRemove) {
      showGrowlMessage(
        dispatch,
        MESSAGE.PRODUCT_UNSHIPPABLE_REMOVED,
        0,
        undefined,
        res.unshippableProducts
      );
    }
    dispatch(updateBasket(res));
    if (source == "checkout" && isLoggedIn && res.redirectToCart) {
      dispatch(updateLoader(false));
      dispatch(updateCheckoutLoader(false));
      history?.push("/cart", {});
    }
    return res;
  },

  addToBasket: async function(
    dispatch: Dispatch,
    productId: ProductID,
    quantity: number,
    productSku?: string,
    bridalId?: number,
    url?: string
  ) {
    const payLoad = bridalId
      ? { quantity, bridalId, url }
      : productId
      ? { productId, quantity }
      : { productSku, quantity };
    const res = await API.post<Basket>(
      dispatch,
      `${__API_HOST__ + "/myapi/basket/add_product/"}`,
      payLoad
    );
    dispatch(updateBasket(res));
    return res;
  },
  updateToBasket: async function(
    dispatch: Dispatch,
    line: ProductID,
    quantity: number,
    source?: string
  ) {
    const res = await API.post<Basket>(
      dispatch,
      `${__API_HOST__}/myapi/basket/update_product/${
        source ? "?source=" + source : ""
      }`,
      {
        line,
        quantity
      }
    );
    if (
      (res.updated || res.publishRemove) &&
      res.updatedRemovedItems &&
      res.updatedRemovedItems.length > 0
    ) {
      showGrowlMessage(
        dispatch,
        MESSAGE.PRODUCT_UNPUBLISHED,
        0,
        undefined,
        res.updatedRemovedItems
      );
    }
    if (res.unshippableRemove) {
      showGrowlMessage(
        dispatch,
        MESSAGE.PRODUCT_UNSHIPPABLE_REMOVED,
        0,
        undefined,
        res.unshippableProducts
      );
    }
    dispatch(updateBasket(res));
    return res;
  },
  deleteBasket: async function(
    dispatch: Dispatch,
    basketLineId: ProductID,
    source?: string
  ) {
    const res = await API.post<Basket>(
      dispatch,
      `${__API_HOST__}/myapi/basket/remove_basket_line/${
        source ? "?source=" + source : ""
      }`,
      {
        basketLineId
      }
    );
    if (
      (res.updated || res.publishRemove) &&
      res.updatedRemovedItems &&
      res.updatedRemovedItems.length > 0
    ) {
      showGrowlMessage(
        dispatch,
        MESSAGE.PRODUCT_UNPUBLISHED,
        0,
        undefined,
        res.updatedRemovedItems
      );
    }
    if (res.unshippableRemove) {
      showGrowlMessage(
        dispatch,
        MESSAGE.PRODUCT_UNSHIPPABLE_REMOVED,
        0,
        undefined,
        res.unshippableProducts
      );
    }
    dispatch(updateBasket(res));
  },
  removeOutOfStockItems: async function(dispatch: Dispatch, source?: string) {
    const res = await API.post<{ message: string; basket: Basket }>(
      dispatch,
      `${__API_HOST__}/myapi/basket/remove_out_of_stock/${
        source ? "?source=" + source : ""
      }`,
      null
    );
    // if (
    //   (res.basket.updated || res.basket.publishRemove) &&
    //   res.basket.updatedRemovedItems &&
    //   res.basket.updatedRemovedItems.length > 0
    // ) {
    //   showGrowlMessage(
    //     dispatch,
    //     MESSAGE.PRODUCT_UNPUBLISHED,
    //     0,
    //     undefined,
    //     res.basket.updatedRemovedItems
    //   );
    // }
    // if (res.message === "Success") {
    //   showGrowlMessage(dispatch, MESSAGE.PRODUCT_OUT_OF_STOCK_REMOVED, 3000);
    // }
    dispatch(updateBasket(res.basket));
    return res;
  }
};
