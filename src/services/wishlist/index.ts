import { Dispatch } from "redux";
// typings
import { WishlistResponse, WishlistCountResponse } from "./typings";
// actions
import { updateWishlist, createSharedLink } from "actions/wishlist";
// utils
import API from "utils/api";
import { ProductID } from "typings/id";
import { ApiResponse } from "typings/api";
import BasketService from "services/basket";
import WishlistService from "services/wishlist";
import { Basket } from "typings/basket";
import { MESSAGE } from "constants/messages";
import { showGrowlMessage } from "../../utils/validate";
import { createSharedLinkResponse } from "typings/wishlist";
import { countWishlist } from "actions/wishlist";

export default {
  updateWishlist: async function(dispatch: Dispatch, sortBy = "added_on") {
    const res = await API.get<WishlistResponse>(
      dispatch,
      `${__API_HOST__}/myapi/wishlist/?sort_by=${sortBy}`
    );

    dispatch(
      updateWishlist(
        res.data,
        sortBy,
        res.sortedDiscount,
        res.owner_name,
        "",
        res.sharable_link
      )
    );
  },

  updateWishlistShared: async function(
    dispatch: Dispatch,
    uid?: string,
    sortBy = "added_on"
  ) {
    try {
      const res = await API.get<WishlistResponse>(
        dispatch,
        `${__API_HOST__}/myapi/wishlist/get_sharable_wishlist_items/${uid}?sort_by=${sortBy}`
      );
      dispatch(
        updateWishlist(
          res.data || [],
          sortBy,
          res.sortedDiscount,
          res?.owner_name,
          res?.data?.length === 0
            ? "Looks like there are no items in the list."
            : ""
        )
      );
    } catch (e) {
      dispatch(
        updateWishlist(
          [],
          sortBy,
          undefined,
          "",
          "Looks like this link does not exist."
        )
      );
    }
  },

  resetWishlist: function(dispatch: Dispatch) {
    dispatch(updateWishlist([]));
  },

  addToWishlist: async function(
    dispatch: Dispatch,
    productId: ProductID,
    size?: string,
    isShared?: boolean
  ) {
    const res = await API.post<WishlistResponse & ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/wishlist/"}`,
      {
        productId,
        size
      }
    );
    if (isShared) {
      WishlistService.countWishlist(dispatch);
    } else {
      dispatch(updateWishlist(res.data, "added_on"));
    }
    return res;
  },

  removeFromWishlist: async function(
    dispatch: Dispatch,
    productId?: ProductID,
    id?: number,
    sortBy = "added_on",
    size?: string,
    isShared?: boolean
  ) {
    const res = await API.delete<WishlistResponse & ApiResponse>(
      dispatch,
      `${__API_HOST__}/myapi/wishlist/`,
      {
        productId,
        id,
        sortBy: sortBy,
        size
      }
    );

    if (isShared) {
      WishlistService.countWishlist(dispatch);
    } else {
      dispatch(updateWishlist(res.data, sortBy));
    }
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
    await this.countWishlist(dispatch);
    return res;
  },

  moveToWishlist: async function(
    dispatch: Dispatch,
    basketLineId: ProductID,
    size: string,
    source?: string,
    sortBy?: string,
    isShared?: boolean
  ) {
    const res = await API.post<WishlistResponse & ApiResponse>(
      dispatch,
      `${__API_HOST__}/myapi/wishlist/move_to_wishlist/`,
      {
        basketLineId,
        size,
        sortBy
      }
    );

    if (res.success) {
      if (isShared) {
        WishlistService.countWishlist(dispatch);
      } else {
        dispatch(updateWishlist(res.data, sortBy));
      }

      BasketService.fetchBasket(dispatch, source);
    }
  },
  undoMoveToWishlist: async function(dispatch: Dispatch, isShared?: boolean) {
    const res = await API.post<{
      basket: Basket;
      isSuccess: boolean;
      message: string;
    }>(
      dispatch,
      `${__API_HOST__}/myapi/wishlist/wishlist_undo/?source=cart`,
      null
    );
    if (
      (res.basket.updated || res.basket.publishRemove) &&
      res.basket.updatedRemovedItems &&
      res.basket.updatedRemovedItems.length > 0
    ) {
      showGrowlMessage(
        dispatch,
        MESSAGE.PRODUCT_UNPUBLISHED,
        0,
        undefined,
        res.basket.updatedRemovedItems
      );
    }
    if (res.basket.unshippableRemove) {
      showGrowlMessage(
        dispatch,
        MESSAGE.PRODUCT_UNSHIPPABLE_REMOVED,
        0,
        undefined,
        res.basket.unshippableProducts
      );
    }
    if (!isShared) {
      await this.updateWishlist(dispatch);
    }
    await this.countWishlist(dispatch);
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
  },

  createSharedWishlistLink: async function(dispatch: Dispatch) {
    const res = await API.get<createSharedLinkResponse>(
      dispatch,
      `${__API_HOST__}/myapi/wishlist/create_wishlist_link/`
    );

    dispatch(createSharedLink(res));
  },
  deleteSharedWishlistLink: async function(dispatch: Dispatch) {
    const res = await API.delete<createSharedLinkResponse>(
      dispatch,
      `${__API_HOST__}/myapi/wishlist/create_wishlist_link/`,
      {}
    );

    dispatch(createSharedLink({ ...res, wishlist_link: "" }));
  },
  countWishlist: async function(dispatch: Dispatch) {
    const res = await API.get<WishlistCountResponse>(
      dispatch,
      `${__API_HOST__}/myapi/wishlist/wishlist_count/`
    );
    dispatch(countWishlist(res.count));
    // return res;
  }
};
