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
    USD: 0,
    AED: 0,
    SGD: 0
  },
  discountedPriceRecords: {
    INR: 0,
    GBP: 0,
    USD: 0,
    AED: 0,
    SGD: 0
  },
  partial: true,
  title: "",
  url: "",
  childAttributes: [],
  plpImages: [],
  productClass: "",
  plpSliderImages: [],
  invisibleFields: [],
  altText: ""
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
      bannerMobile: "",
      bannerUrl: "",
      filtered_facets: {}
    }
  },
  facetObject: {},
  plpProductId: [],
  filterState: false,
  onload: false,
  plpMobileView: "grid",
  plpTemplates: {
    categoryShop: "",
    templates: []
  }
};

export const plplist = (state = initialState, action: PlpActions): State => {
  switch (action.type) {
    case "ADD_PLP_LIST": {
      const newState = { ...state };
      newState.data = action.payload;
      newState.onload = false;
      const list = action.payload.results.data.map(({ id }) => id);
      newState.plpProductId = list;
      return newState;
    }

    case "UPDATE_PLP_TEMPLATES": {
      const newState = { ...state };
      newState.plpTemplates = action.payload;
      return newState;
    }

    case "NEW_PLP_LIST": {
      const newState = { ...state };
      newState.data = action.payload;
      newState.onload = true;
      const list = action.payload.results.data.map(({ id }) => id);
      newState.plpProductId = list;
      return newState;
    }

    case "UPDATE_ONLOAD": {
      const newState = { ...state };
      newState.onload = action.payload;
      return newState;
    }

    case "UPDATE_FACET": {
      const newState = { ...state };
      newState.onload = false;
      newState.facetObject = action.payload;
      return newState;
    }
    case "UPDATE_PLP_MOBILE_VIEW": {
      const newState = { ...state };
      newState.plpMobileView = action.payload;
      return newState;
    }
  }
  return state;
};
