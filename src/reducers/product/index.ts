import { State, ProductActions } from "./typings";

const initialState: State = {};

export const product = (
  state = initialState,
  action: ProductActions
): State => {
  switch (action.type) {
    case "UPDATE_PRODUCT": {
      const product = action.payload;
      const newState = { ...state };
      newState[product.id] = product;
      return newState;
    }
  }

  return state;
};
