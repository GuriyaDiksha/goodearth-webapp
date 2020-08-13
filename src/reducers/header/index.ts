import { HeaderState, HeaderActions } from "./typings";

const initialState: HeaderState = {
  data: [],
  announcementData: {
    bgColorcode: "",
    bridalBgColorcode: "",
    isBridalActive: false,
    message: "",
    url: null
  }
};

export const header = (
  state: HeaderState = initialState,
  action: HeaderActions
) => {
  switch (action.type) {
    case "UPDATE_HEADER": {
      const newState = { ...state };
      newState.data = action.payload;
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
  }
  return state;
};
