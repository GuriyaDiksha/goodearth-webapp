import { actionCreator } from "utils/actionCreator";
import { WishlistItem, createSharedLinkResponse } from "typings/wishlist";

export const updateWishlist = (
  items: WishlistItem[],
  sortBy = "added_on",
  sortedDiscount = false,
  owner_name = "",
  message = ""
) =>
  actionCreator("UPDATE_WISHLIST", {
    items,
    sortBy,
    sortedDiscount,
    owner_name,
    message
  });

export const createSharedLink = (payload: createSharedLinkResponse) =>
  actionCreator("CREATE_SHARED_LINK", payload);

export const countWishlist = (count: number) =>
  actionCreator("WISHLIST_COUNT", { count });
