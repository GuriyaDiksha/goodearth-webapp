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
import { showMessage } from "actions/growlMessage";
import { PRODUCT_UNPUBLISHED } from "constants/messages";

export default {
  updateWishlist: async function(dispatch: Dispatch, sortBy = "added_on") {
    const res = await API.get<WishlistResponse>(
      dispatch,
      `${__API_HOST__}/myapi/wishlist/?sort_by=${sortBy}`
    );

    dispatch(updateWishlist(res.data, sortBy));
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
    sortyBy = "added_on"
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

  moveToWishlist: async function(
    dispatch: Dispatch,
    basketLineId: ProductID,
    source?: string,
    sortBy?: string
  ) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__}/myapi/wishlist/move_to_wishlist/`,
      {
        basketLineId
      }
    );

    if (res.success) {
      this.updateWishlist(dispatch, sortBy);
      BasketService.fetchBasket(dispatch, source);
    }
  },
  undoMoveToWishlist: async function(dispatch: Dispatch, source?: string) {
    const res = await API.post<{
      basket: Basket;
      isSuccess: boolean;
      message: string;
    }>(
      dispatch,
      `${__API_HOST__}/myapi/wishlist/wishlist_undo/?source=cart`,
      null
    );
    if (res.basket.updated || res.basket.publishRemove) {
      dispatch(showMessage(PRODUCT_UNPUBLISHED));
    }
    return res;
  },

  modifyWishlistItem: async function(
    dispatch: Dispatch,
    id: number,
    size: string,
    quantity?: number,
    sortBy?: string
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
    await this.updateWishlist(dispatch, sortBy);
    return res;
  }
};
