import { HeaderState, HeaderActions } from "./typings";

const initialState: HeaderState = {
  megaMenuData: [],
  announcementData: {
    bgColorcode: "",
    bridalBgColorcode: "",
    isBridalActive: false,
    data: []
  },
  timerData: null,
  storeData: {
    data: [],
    visible: false
  },
  sizeChartData: {
    data: {
      fitGuide: {
        image: "",
        pointers: []
      },
      sizeGuide: {
        data: [],
        measurements: [],
        sizes: [],
        note: "",
        disclaimer: ""
      }
    },
    show: false
  }
};

export const header = (
  state: HeaderState = initialState,
  action: HeaderActions
) => {
  switch (action.type) {
    case "UPDATE_HEADER": {
      const newState = { ...state };
      newState.megaMenuData = action.payload;
      {
        return { ...newState };
      }
    }
    case "UPDATE_ANNOUNCEMENT_BAR": {
      const newState = { ...state };
      newState.announcementData = action.payload;
      {
        return { ...newState };
      }
    }
    case "UPDATE_TIMER_DATA": {
      const newState = { ...state };
      newState.timerData = action.payload;
      return newState;
    }

    case "UPDATE_STORE_DATA": {
      const newState = { ...state };
      newState.storeData.data = action.payload;
      return newState;
    }

    case "UPDATE_STORE_STATE": {
      const newState = { ...state };
      newState.storeData.visible = action.payload;
      return newState;
    }
    case "UPDATE_SIZE_CHART_DATA": {
      const newState = { ...state };
      newState.sizeChartData.data = action.payload;
      return newState;
    }
    case "UPDATE_SIZE_CHART_SHOW": {
      const newState = { ...state };
      newState.sizeChartData.show = action.payload;
      return newState;
    }
  }
  return state;
};
