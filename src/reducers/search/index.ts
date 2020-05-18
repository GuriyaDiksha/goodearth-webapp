import { State, SearchActions } from "./typings";
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
      bannerMobile: ""
    }
  },
  facetObject: {},
  searchProductId: [],
  filterState: false,
  onload: false
};

export const searchList = (
  state = initialState,
  action: SearchActions
): State => {
  switch (action.type) {
    case "ADD_SEARCH_LIST": {
      const newState = { ...state };
      newState.data = action.payload;
      newState.onload = false;
      const list = action.payload.results.data.map(({ id }) => id);
      newState.searchProductId = list;
      return newState;
    }

    case "NEW_SEARCH_LIST": {
      const newState = { ...state };
      newState.data = action.payload;
      newState.onload = true;
      const list = action.payload.results.data.map(({ id }) => id);
      newState.searchProductId = list;
      return newState;
    }
  }
  return state;
};
