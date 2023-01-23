import { Currency } from "typings/currency";
import { actionCreator } from "utils/actionCreator";

export const updateSales = (isSale: boolean) =>
  actionCreator("UPDATE_SALE", isSale);

export const updateGiftWrap = (showGiftwrap: boolean) =>
  actionCreator("UPDATE_GIFT_WRAP", showGiftwrap);

export const updatePromo = (showPromo: boolean) =>
  actionCreator("UPDATE_PROMO", showPromo);

export const updateDeliveryInstruction = (showDeliveryInstruction: boolean) =>
  actionCreator("UPDATE_DELIVERY_INSTRUCTION", showDeliveryInstruction);

export const updatePopupBgUrl = (popupBgUrl: string) =>
  actionCreator("UPDATE_POPUP_BG_URL", popupBgUrl);

export const updateCurrencyList = (data: Currency[]) =>
  actionCreator("UPDATE_CURRENCY_LIST", data);

export const updateMakerReloadToggle = (makerReloadToggle: boolean) =>
  actionCreator("UPDATE_MAKER_RELOAD_TOGGLE", makerReloadToggle);

export const updateNextUrl = (nextUrl: string) =>
  actionCreator("UPDATE_NEXT_URL", nextUrl);

export const updateDeliveryText = (text: string) =>
  actionCreator("UPDATE_DELIVERY_TEXT", text);

export const updateScrollDown = (scrollDown: boolean) =>
  actionCreator("UPDATE_SCROLL_DOWN", scrollDown);

export const updateMicroUrl = (url: string) =>
  actionCreator("UPDATE_MICRO_URL", url);

export const updateShowCookie = (showCookie: boolean) =>
  actionCreator("UPDATE_SHOW_COOKIE", showCookie);

export const updateShowTimer = (showTimer: boolean) =>
  actionCreator("UPDATE_SHOW_TIMER", showTimer);

export const updateLoader = (isLoading: boolean) =>
  actionCreator("UPDATE_LOADER", isLoading);

export const updateCookiePrefrence = (showCookie: boolean) =>
  actionCreator("UPDATE_SHOW_COOKIE_PREF", showCookie);
