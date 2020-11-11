import * as Actions from "actions/wishlist";
import { ActionType } from "typings/actionCreator";
import { WishlistItem } from "typings/wishlist";

export type State = {
  items: WishlistItem[];
  sortBy: string;
};

export { Actions };

export type WishlistActions = ActionType<typeof Actions>;
