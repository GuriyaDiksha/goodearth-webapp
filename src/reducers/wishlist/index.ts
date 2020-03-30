import { State, WishlistActions } from "./typings";

const initialState: State = {
  items: []
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
