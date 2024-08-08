import { WishlistItem, WishlistData } from "typings/wishlist";

export type WishlistResponse = {
  data: WishlistData[];
  sortedDiscount?: boolean;
  owner_name: string;
  message?: string;
  sharable_link?: string;
};

export type WishlistCountResponse = {
  count: number;
};

export type WishlisNameItems = {
  id: number;
  name: string;
  key: string;
  visibility: string;
  date_created: string;
  session_id: any;
  sharable_link: string;
  owner: number;
};

export type WishlistNameData = {
  data: WishlisNameItems[];
  success: boolean;
};
