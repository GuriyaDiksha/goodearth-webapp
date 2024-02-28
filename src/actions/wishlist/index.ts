import { actionCreator } from "utils/actionCreator";
import { WishlistItem, createSharedLinkResponse } from "typings/wishlist";

export const updateWishlist = (
  items: WishlistItem[],
  sortBy = "added_on",
  sortedDiscount = false,
  owner_name = "", //Added for shared wishlist
  message = "", //Added for shared wishlist
  sharable_link = "" //Added for shared current user's wishlist
) =>
  actionCreator("UPDATE_WISHLIST", {
    items,
    sortBy,
    sortedDiscount,
    owner_name,
    message,
    wishlist_link: sharable_link
  });

export const createSharedLink = (payload: createSharedLinkResponse) =>
  actionCreator("CREATE_SHARED_LINK", payload);

export const countWishlist = (count: number) =>
  actionCreator("WISHLIST_COUNT", { count });
