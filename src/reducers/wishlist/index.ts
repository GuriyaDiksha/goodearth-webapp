import { State, WishlistActions } from "./typings";

const initialState: State = {
  items: [],
  sortBy: "added_on",
  sortedDiscount: false,
  count: 0
};

export const wishlist = (
  state = initialState,
  action: WishlistActions
): State => {
  // debugger
  switch (action.type) {
    case "UPDATE_WISHLIST": {
      return {
        ...state,
        ...action.payload
      };
    }
    case "WISHLIST_COUNT": {
      return {
        ...state,
        count: action.payload.count
      };
    }
  }

  return state;
};
