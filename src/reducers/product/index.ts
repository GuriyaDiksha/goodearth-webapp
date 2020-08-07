import { State, ProductActions } from "./typings";
import { mergePartialProducts } from "utils/store";
import { PartialProductItem } from "typings/product";

const initialState: State = {};

export const PRODUCT_INIT_STATE: PartialProductItem = {
  id: 0,
  categories: [],
  collections: [],
  discount: false,
  priceRecords: {
    INR: 0,
    GBP: 0,
    USD: 0
  },
  discountedPriceRecords: {
    INR: 0,
    GBP: 0,
    USD: 0
  },
  gaVariant: "",
  partial: true,
  sku: "",
  title: "",
  url: "",
  childAttributes: [],
  images: [],
  plpImages: [],
  productClass: ""
};

export const product = (
  state = initialState,
  action: ProductActions
): State => {
  switch (action.type) {
    case "UPDATE_PRODUCT": {
      const product = action.payload;
      const currentProduct = state[product.id] || PRODUCT_INIT_STATE;
      let newState = { ...state };
      const recommendedProducts = product.recommendedProducts.map(
        ({ id }) => id
      );
      newState[product.id] = {
        ...currentProduct,
        ...product,
        recommendedProducts
      };
      newState = mergePartialProducts(newState, product.recommendedProducts);
      return newState;
    }

    case "UPDATE_PARTIAL_PRODUCTS": {
      const { products } = action.payload;
      let newState = { ...state };
      newState = mergePartialProducts(newState, products);
      return newState;
    }

    case "UPDATE_PLP_PRODUCT": {
      const products = action.payload;
      let newState = { ...state };
      newState = mergePartialProducts(newState, products);
      return newState;
    }

    case "UPDATE_COLLECTION_PRODUCTS": {
      const { id, products } = action.payload;
      const newState = { ...state };
      const product = state[id] || PRODUCT_INIT_STATE;
      newState[id] = { ...product, collectionProducts: products };
      return newState;
    }
  }
  return state;
};
