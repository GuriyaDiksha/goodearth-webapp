import { State, PlpActions } from "./typings";
// import { mergePartialProducts } from "utils/store";
import { PLPProductItem } from "typings/product";

export const PRODUCT_INIT_STATE: PLPProductItem = {
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
  partial: true,
  title: "",
  url: "",
  childAttributes: [],
  plpImages: []
};

const initialState: State = {
  data: {
    count: 0,
    next: "",
    previous: "",
    results: {
      facets: {},
      breadcrumb: [],
      data: [],
      banner: "",
      banner_mobile: ""
    }
  },
  facetObject: {}
};

export const plplist = (state = initialState, action: PlpActions): State => {
  switch (action.type) {
    case "ADD_PLP_LIST": {
      //   const product = action.payload;
      //   const currentProduct = state[product.id] || PRODUCT_INIT_STATE;
      const newState = { ...state };
      newState.data = action.payload;
      //   const recommendedProducts = product.recommendedProducts.map(
      //     ({ id }) => id
      //   );
      //   newState[product.id] = {
      //     ...currentProduct,
      //     ...product,
      //     recommendedProducts
      //   };
      //   newState = mergePartialProducts(newState, product.recommendedProducts);
      return newState;
    }

    case "UPDATE_FACET": {
      const newState = { ...state };
      newState.facetObject = action.payload;
      return newState;
    }
  }
  return state;
};
