import { State, InfoActions } from "./typings";

const initialState: State = {
  isSale: false,
  popupBgUrl: ""
};

export const info = (state: State = initialState, action: InfoActions) => {
  switch (action.type) {
    case "UPDATE_SALE": {
      const newState = { ...state };
      newState.isSale = action.payload;
      return newState;
    }
    case "UPDATE_POPUP_BG_URL": {
      const newState = { ...state };
      newState.popupBgUrl = action.payload;
      return newState;
    }
  }

  return state;
};
