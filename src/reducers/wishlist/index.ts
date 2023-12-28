import { State, WishlistActions } from "./typings";

const initialState: State = {
  items: [],
  sortBy: "added_on",
  sortedDiscount: false,
  is_success: false,
  message: "string",
  secret_key: "",
  wishlist_link: ""
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
    case "CREATE_SHARED_LINK": {
      return {
        ...state,
        ...action.payload
      };
    }
  }

  return state;
};
