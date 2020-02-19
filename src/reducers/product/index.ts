import { State, ProductActions } from "./typings";
import { mergePartialProducts } from "utils/store";

const initialState: State = {};

export const product = (
  state = initialState,
  action: ProductActions
): State => {
  switch (action.type) {
    case "UPDATE_PRODUCT": {
      const product = action.payload;
      let newState = { ...state };
      newState[product.id] = product;

      const recommendedProducts = product.recommendedProducts.map(
        ({ id }) => id
      );
      newState[product.id] = { ...product, recommendedProducts };
      newState = mergePartialProducts(newState, product.recommendedProducts);
      return newState;
    }
  }

  return state;
};
