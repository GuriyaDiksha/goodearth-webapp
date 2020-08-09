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
import { Basket } from "typings/basket";

export default {
  updateWishlist: async function(dispatch: Dispatch, sortBy = "sequence") {
    const res = await API.get<WishlistResponse>(
      dispatch,
      `${__API_HOST__}/myapi/wishlist/?sort_by=${sortBy}`
    );

    dispatch(updateWishlist(res.data));
  },

  resetWishlist: function(dispatch: Dispatch) {
    dispatch(updateWishlist([]));
  },

  addToWishlist: async function(
    dispatch: Dispatch,
    productId: ProductID,
    size?: string
  ) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/wishlist/"}`,
      {
        productId,
        size
      }
    );
    this.updateWishlist(dispatch);
    return res;
  },

  removeFromWishlist: async function(
    dispatch: Dispatch,
    productId?: ProductID,
    id?: number,
    sortyBy = "sequence"
  ) {
    const res = await API.delete<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/wishlist/"}`,
      {
        productId,
        id
      }
    );
    await this.updateWishlist(dispatch, sortyBy);
    return res;
  },

  updateWishlistSequencing: async function(
    dispatch: Dispatch,
    sequencing: [number, number][]
  ) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__}/myapi/wishlist/sequencing/`,
      {
        sequencing
      }
    );
    await this.updateWishlist(dispatch);
    return res;
  },

  moveToWishlist: async function(dispatch: Dispatch, basketLineId: ProductID) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__}/myapi/wishlist/move_to_wishlist/`,
      {
        basketLineId
      }
    );

    if (res.success) {
      this.updateWishlist(dispatch);
      BasketService.fetchBasket(dispatch);
    }
  },
  undoMoveToWishlist: async function(dispatch: Dispatch) {
    const res = await API.post<{
      basket: Basket;
      isSuccess: boolean;
      message: string;
    }>(dispatch, `${__API_HOST__}/myapi/wishlist/wishlist_undo/`, null);
    return res;
  },

  modifyWishlistItem: async function(
    dispatch: Dispatch,
    id: number,
    size: string,
    quantity?: number
  ) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__}/myapi/wishlist/update/`,
      {
        id,
        quantity,
        size
      }
    );
    await this.updateWishlist(dispatch);
    return res;
  }
};
