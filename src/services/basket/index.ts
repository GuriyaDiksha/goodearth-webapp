import { Dispatch } from "redux";
// typings
import { Basket } from "typings/basket";
// actions
import { updateBasket } from "actions/basket";
// utils
import API from "utils/api";
import { ProductID } from "typings/id";

export default {
  fetchBasket: async function(dispatch: Dispatch) {
    const res = await API.get<Basket>(
      dispatch,
      "http://api.goodearth.in/myapi/basket/detail"
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
      "http://api.goodearth.in/myapi/basket/add_product/",
      {
        productId,
        quantity
      }
    );
    dispatch(updateBasket(res));
  },
  updateToBasket: async function(
    dispatch: Dispatch,
    line: ProductID,
    quantity: number
  ) {
    const res = await API.post<Basket>(
      dispatch,
      "http://api.goodearth.in/myapi/basket/update_product/",
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
      "http://api.goodearth.in/myapi/basket/remove_basket_line/",
      {
        basketLineId
      }
    );

    dispatch(updateBasket(res));
  }
};
