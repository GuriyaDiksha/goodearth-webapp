import { State, InfoActions } from "./typings";

const initialState: State = {
  isSale: false,
  popupBgUrl: "",
  currencyList: [],
  makerReloadToggle: false,
  nextUrl: "",
  deliveryText: "",
  scrollDown: false,
  microUrl: ""
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
    case "UPDATE_CURRENCY_LIST": {
      const newState = { ...state };
      newState.currencyList = action.payload;
      return newState;
    }
    case "UPDATE_MAKER_RELOAD_TOGGLE": {
      const newState = { ...state };
      newState.makerReloadToggle = action.payload;
      return newState;
    }
    case "UPDATE_NEXT_URL": {
      const newState = { ...state };
      newState.nextUrl = action.payload;
      return newState;
    }
    case "UPDATE_DELIVERY_TEXT": {
      const newState = { ...state };
      newState.deliveryText = action.payload;
      return newState;
    }
    case "UPDATE_SCROLL_DOWN": {
      const newState = { ...state };
      newState.scrollDown = action.payload;
      return newState;
    }
    case "UPDATE_MICRO_URL": {
      const newState = { ...state };
      newState.microUrl = action.payload;
      return newState;
    }
  }

  return state;
};
