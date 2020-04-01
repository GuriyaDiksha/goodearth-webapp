import { CollectionState, DeviceActions } from "./typings";

const initialState: CollectionState = {
  data: {
    description: "",
    level2Categories: []
  },
  result: [],
  collectionSpecficdata: {
    count: 0,
    breadcrumbs: [],
    shortDescription: "",
    longDescription: "",
    results: []
  },
  collectionSpecficBanner: {
    name: "",
    description: "",
    widgetImages: [],
    backgroundImage: "",
    enabled: false,
    products: [],
    id: 0
  }
};

export const collection = (
  state: CollectionState = initialState,
  action: DeviceActions
) => {
  switch (action.type) {
    case "UPDATE_COLLECTION_FILTER": {
      const newState = { ...state };
      newState.data = action.payload;
      {
        return { ...newState };
      }
    }
    case "UPDATE_COLLECTION_DATA": {
      const newState = { ...state };
      newState.result = action.payload;
      return newState;
    }
    case "UPDATE_COLLECTION_SPECIFIC_DATA": {
      const newState = { ...state };
      newState.collectionSpecficdata = action.payload;
      return { ...newState };
    }
    case "UPDATE_COLLECTION_BANNER_DATA": {
      const newState = { ...state };
      newState.collectionSpecficBanner = action.payload;
      return { ...newState };
    }
  }
  return state;
};
