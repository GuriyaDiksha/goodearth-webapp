import { Dispatch } from "redux";
// typings
import { WishlistResponse } from "./typings";
// actions
import { updateWishlist } from "actions/wishlist";
// utils
import API from "utils/api";
import { ProductID } from "typings/id";
import { ApiResponse } from "typings/api";
import BasketService from "services/basket";

export default {
  updateWishlist: async function(dispatch: Dispatch) {
    const res = await API.get<WishlistResponse>(
      dispatch,
      "http://api.goodearth.in/myapi/wishlist/"
    );

    dispatch(updateWishlist(res.data));
  },

  resetWishlist: function(dispatch: Dispatch) {
    dispatch(updateWishlist([]));
  },

  addToWishlist: async function(dispatch: Dispatch, productId: ProductID) {
    const res = await API.post<ApiResponse>(
      dispatch,
      "http://api.goodearth.in/myapi/wishlist/",
      {
        productId
      }
    );

    if (res.success) {
      this.updateWishlist(dispatch);
    }
  },

  removeFromWishlist: async function(dispatch: Dispatch, productId: ProductID) {
    const res = await API.delete<ApiResponse>(
      dispatch,
      "http://api.goodearth.in/myapi/wishlist/",
      {
        productId
      }
    );

    if (res.success) {
      this.updateWishlist(dispatch);
    }
  },

  moveToWishlist: async function(dispatch: Dispatch, basketLineId: ProductID) {
    const res = await API.post<ApiResponse>(
      dispatch,
      "http://api.goodearth.in/myapi/wishlist/move_to_wishlist/",
      {
        basketLineId
      }
    );

    if (res.success) {
      this.updateWishlist(dispatch);
      BasketService.fetchBasket(dispatch);
    }
  }
};
