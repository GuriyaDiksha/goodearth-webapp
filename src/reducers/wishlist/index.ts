import { State, WishlistActions } from "./typings";

const initialState: State = {
  items: [],
  // sortBy: "added_on",
  sortedDiscount: false,
  // is_success: false,
  message: "",
  // secret_key: "",
  // wishlist_link: "",
  owner_name: "",
  // count: 0,
  sharedItems: []
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
    // case "WISHLIST_COUNT": {
    //   return {
    //     ...state,
    //     count: action.payload.count
    //   };
    // }
    case "UPDATE_WISHLIST_SHARED": {
      return {
        ...state,
        ...action.payload
      };
    }
  }

  return state;
};
