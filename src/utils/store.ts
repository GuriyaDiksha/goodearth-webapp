import { PartialProductItem, PLPProductItem } from "typings/product";
import { State } from "reducers/product/typings";

export const mergePartialProducts = (
  state: State,
  products: PartialProductItem[] | PLPProductItem[]
) => {
  const newState = { ...state };

  products.forEach(product => {
    const { id } = product;

    const stateProduct = newState[id];

    if (!stateProduct || stateProduct.partial) {
      newState[id] = { ...stateProduct, ...product, partial: true };
    }
  });

  return newState;
};
