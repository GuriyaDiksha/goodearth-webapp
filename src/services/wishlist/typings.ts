import { WishlistItem } from "typings/wishlist";

export type WishlistResponse = {
  data: WishlistItem[];
  sortedDiscount: boolean;
  owner_name: string;
  message?: string;
};
