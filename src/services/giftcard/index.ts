import { Dispatch } from "redux";
// typings
import { WishlistResponse } from "./typings";
// actions
import { giftcardBalance } from "actions/giftcard";
// utils
import API from "utils/api";
import { ProductID } from "typings/id";
import { ApiResponse } from "typings/api";

export default {
  addToWishlist: async function(dispatch: Dispatch, productId: ProductID) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/wishlist/"}`,
      {
        productId
      }
    );

    if (res.success) {
      //   this.updateWishlist(dispatch);
    }
  }
};
