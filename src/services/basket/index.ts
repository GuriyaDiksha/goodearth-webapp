import { Dispatch } from "redux";
// typings
import { Basket } from "typings/basket";
// actions
import { updateBasket } from "actions/basket";
// utils
import API from "utils/api";
import { ProductID } from "typings/id";

export default {
  fetchBasket: async function(dispatch: Dispatch, source?: string) {
    const res = await API.get<Basket>(
      dispatch,
      `${__API_HOST__}/myapi/basket/detail${source ? "?source=" + source : ""}`
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

    dispatch(updateBasket(res));
  },
  removeOutOfStockItems: async function(dispatch: Dispatch) {
    const res = await API.post<{ message: string; basket: Basket }>(
      dispatch,
      `${__API_HOST__}/myapi/basket/remove_out_of_stock/`,
      null
    );
    dispatch(updateBasket(res.basket));
    return res;
  }
};
