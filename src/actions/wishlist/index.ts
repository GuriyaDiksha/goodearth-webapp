import { actionCreator } from "utils/actionCreator";
import { WishlistItem } from "typings/wishlist";

export const updateWishlist = (
  items: WishlistItem[],
  sortBy = "added_on",
  sortedDiscount = false
) => actionCreator("UPDATE_WISHLIST", { items, sortBy, sortedDiscount });
