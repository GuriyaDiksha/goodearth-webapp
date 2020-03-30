import { actionCreator } from "utils/actionCreator";
import { WishlistItem } from "typings/wishlist";

export const updateWishlist = (items: WishlistItem[]) =>
  actionCreator("UPDATE_WISHLIST", { items });
