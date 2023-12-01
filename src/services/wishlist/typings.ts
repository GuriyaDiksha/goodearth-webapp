import { WishlistItem } from "typings/wishlist";

export type WishlistResponse = {
  data: WishlistItem[];
  sortedDiscount: boolean;
};

export type WishlistCountResponse = {
  count: number;
};
