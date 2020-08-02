import { Dispatch } from "redux";
// typings
import { Basket } from "typings/basket";
// actions
import { updateBasket } from "actions/basket";
// utils
import API from "utils/api";
import { ProductID } from "typings/id";

export default {
  fetchBasket: async function(dispatch: Dispatch, isCheckout?: boolean) {
    const res = await API.get<Basket>(
      dispatch,
      `${__API_HOST__ +
        "/myapi/basket/detail" +
        (isCheckout == true ? "?source=checkout" : "")}`
    );
    dispatch(updateBasket(res));
  },

  addToBasket: async function(
    dispatch: Dispatch,
    productId: ProductID,
    quantity: number
  ) {
    const res = await API.post<Basket>(
      dispatch,
      `${__API_HOST__ + "/myapi/basket/add_product/"}`,
      {
        productId,
        quantity
      }
    );
    dispatch(updateBasket(res));
    return res;
  },
  updateToBasket: async function(
    dispatch: Dispatch,
    line: ProductID,
    quantity: number
  ) {
    const res = await API.post<Basket>(
      dispatch,
      `${__API_HOST__ + "/myapi/basket/update_product/"}`,
      {
        line,
        quantity
      }
    );
    dispatch(updateBasket(res));
    return res;
  },
  deleteBasket: async function(dispatch: Dispatch, basketLineId: ProductID) {
    const res = await API.post<Basket>(
      dispatch,
      `${__API_HOST__ + "/myapi/basket/remove_basket_line/"}`,
      {
        basketLineId
      }
    );

    dispatch(updateBasket(res));
  }
};
