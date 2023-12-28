import { actionCreator } from "utils/actionCreator";
import { WishlistItem, createSharedLinkResponse } from "typings/wishlist";

export const updateWishlist = (
  items: WishlistItem[],
  sortBy = "added_on",
  sortedDiscount = false
) => actionCreator("UPDATE_WISHLIST", { items, sortBy, sortedDiscount });

export const createSharedLink = (payload: createSharedLinkResponse) =>
  actionCreator("CREATE_SHARED_LINK", payload);
