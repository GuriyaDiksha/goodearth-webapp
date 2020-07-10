import { State, ShopActions } from "./typings";

export const initialState: State = {
  shopData: []
};

export const shop = (state = initialState, action: ShopActions): State => {
  switch (action.type) {
    case "UPDATE_SHOP_DATA": {
      const newState = { ...state };
      newState.shopData = action.payload;
      return { ...newState };
    }
  }

  return state;
};
