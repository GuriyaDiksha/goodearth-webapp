import { WishlistItem, WishlistData } from "typings/wishlist";

export type WishlistResponse = {
  data: WishlistData[];
  // sortedDiscount?: boolean;
  // owner_name: string;
  // message?: string;
  // sharable_link?: string;
};

export type WishlistCountResponse = {
  count: number;
};

export type wishlistNameResponse = {
  id: number;
  listName: string;
};

export type WishlistSharedResponse = {
  data: WishlistItem[];
  owner_name: string;
  sortedDiscount?: boolean;
  message?: string;
  wishListName?: string;
};
