import { State, FillerActions } from "./typings";
// import { mergePartialProducts } from "utils/store";
import { PartialProductItem } from "typings/product";

export const PRODUCT_INIT_STATE: PartialProductItem = {
  id: 0,
  categories: [],
  collections: [],
  discount: false,
  priceRecords: {
    INR: -1,
    GBP: -1,
    USD: -1,
    AED: -1,
    SGD: -1
  },
  discountedPriceRecords: {
    INR: -1,
    GBP: -1,
    USD: -1,
    AED: -1,
    SGD: -1
  },
  gaVariant: "",
  partial: true,
  sku: "",
  title: "",
  url: "",
  childAttributes: [],
  images: [],
  plpImages: [],
  productClass: "",
  plpSliderImages: [],
  invisibleFields: [],
  altText: ""
};
const initialState: State = {
  data: PRODUCT_INIT_STATE,
  show: false
};

export const filler = (state = initialState, action: FillerActions): State => {
  switch (action.type) {
    case "UPDATE_FILLER_PRODUCT": {
      const newState = { ...state };
      newState.data = action.payload;
      return newState;
    }
    case "UPDATE_FILLER": {
      const newState = { ...state };
      newState.show = action.payload;
      return newState;
    }
  }
  return state;
};
