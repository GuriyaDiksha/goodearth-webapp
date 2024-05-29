import { State, InfoActions } from "./typings";

const initialState: State = {
  isSale: false,
  popupBgUrl: "",
  currencyList: [],
  makerReloadToggle: false,
  nextUrl: "",
  deliveryText: "",
  scrollDown: false,
  microUrl: "",
  showCookie: false,
  showTimer: false,
  showGiftWrap: false,
  showDeliveryInstruction: false,
  showPromo: false,
  isLoading: false,
  showCookiePref: false,
  showShipping: false, //This will handle scenario of backend order with discounts,
  isLoyaltyFilterOpen: false, //This will handle filter open state inside loyalty transaction page
  openCookiePopup: true
};

export const info = (state: State = initialState, action: InfoActions) => {
  switch (action.type) {
    case "UPDATE_SALE": {
      const newState = { ...state };
      newState.isSale = action.payload;
      return newState;
    }
    case "UPDATE_GIFT_WRAP": {
      const newState = { ...state };
      newState.showGiftWrap = action.payload;
      return newState;
    }
    case "UPDATE_PROMO": {
      const newState = { ...state };
      newState.showPromo = action.payload;
      return newState;
    }
    case "UPDATE_DELIVERY_INSTRUCTION": {
      const newState = { ...state };
      newState.showDeliveryInstruction = action.payload;
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
    case "UPDATE_SHOW_COOKIE": {
      const newState = { ...state };
      newState.showCookie = action.payload;
      return newState;
    }
    case "UPDATE_SHOW_TIMER": {
      const newState = { ...state };
      newState.showTimer = action.payload;
      return newState;
    }
    case "UPDATE_LOADER": {
      const newState = { ...state };
      newState.isLoading = action.payload;
      return newState;
    }
    case "UPDATE_SHOW_COOKIE_PREF": {
      const newState = { ...state };
      newState.showCookiePref = action.payload;
      return newState;
    }
    case "UPDATE_SHOW_SHIPPING_ADDESS": {
      const newState = { ...state };
      newState.showShipping = action.payload;
      return newState;
    }
    case "UPDATE_IS_LOYALTY_FILER_OPEN": {
      const newState = { ...state };
      newState.isLoyaltyFilterOpen = action.payload;
      return newState;
    }
    case "OPEN_COOKIE_POPUP": {
      const newState = { ...state };
      newState.openCookiePopup = action.payload;
      return newState;
    }
    default:
      return state;
  }
};
