import { Dispatch } from "redux";
// typings
import { WishlistResponse } from "./typings";
// actions
import { updateWishlist } from "actions/wishlist";
// utils
import API from "utils/api";
import { ProductID } from "typings/id";
import { ApiResponse } from "typings/api";

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

  addToWishlist: async function(dispatch: Dispatch, productId: ProductID) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/wishlist/"}`,
      {
        productId
      }
    );
    this.updateWishlist(dispatch);
    return res;
  },

  removeFromWishlist: async function(
    dispatch: Dispatch,
    productId: ProductID,
    sortyBy = "sequence"
  ) {
    const res = await API.delete<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/wishlist/"}`,
      {
        productId
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
