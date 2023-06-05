import { CollectionState, DeviceActions } from "./typings";

const initialState: CollectionState = {
  data: {
    description: "",
    level2Categories: []
  },
  collectionIds: [],
  result: [],
  collectionSpecficdata: {
    count: 0,
    breadcrumbs: [],
    shortDescription: "",
    longDescription: "",
    results: [],
    next: 0,
    all_collection_link: "",
    view_more_collections: [],
    tags: [],
    category: ""
  },
  collectionSpecficBanner: {
    name: "",
    description: "",
    widgetImages: [],
    backgroundImage: "",
    enabled: false,
    products: [],
    id: 0
  },
  tags: [],
  filteredCollectionData: [],
  collectionTemplates: {
    id: 0,
    templates: []
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
      const list = action.payload.results.map(({ id }) => id);
      newState.collectionIds = list;
      return { ...newState };
    }
    case "UPDATE_COLLECTION_BANNER_DATA": {
      const newState = { ...state };
      newState.collectionSpecficBanner = action.payload;
      return { ...newState };
    }
    case "UPDATE_TAGS_DATA": {
      const newState = { ...state };
      newState.tags = action.payload;
      return newState;
    }
    case "UPDATE_FILTERED_COLLECTION_DATA": {
      const newState = { ...state };
      newState.filteredCollectionData = action.payload;
      return newState;
    }
    // Collection specific banner reducer
    case "UPDATE_COLLECTION_SPECIFIC_TEMPLATES": {
      const newState = { ...state };
      newState.collectionTemplates = action.payload;
      return newState;
    }
    default:
      return state;
  }
};
