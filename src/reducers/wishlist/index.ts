import { State, WishlistActions } from "./typings";

const initialState: State = {
  items: [],
  sortBy: "added_on"
};

export const wishlist = (
  state = initialState,
  action: WishlistActions
): State => {
  switch (action.type) {
    case "UPDATE_WISHLIST": {
      return {
        ...state,
        ...action.payload
      };
    }
  }

  return state;
};
