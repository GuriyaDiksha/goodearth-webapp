import * as Actions from "actions/wishlist";
import { ActionType } from "typings/actionCreator";
import { WishlistItem } from "typings/wishlist";

export type State = {
  items: WishlistItem[];
  sortBy: string;
  sortedDiscount: boolean;
  is_success: boolean;
  message: string;
  secret_key: string;
  wishlist_link: string;
  owner_name: string;
  count: number;
  sharedItems: WishlistItem[];
};

export { Actions };

export type WishlistActions = ActionType<typeof Actions>;
