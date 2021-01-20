import { Currency } from "typings/currency";
import { actionCreator } from "utils/actionCreator";

export const updateSales = (isSale: boolean) =>
  actionCreator("UPDATE_SALE", isSale);

export const updatePopupBgUrl = (popupBgUrl: string) =>
  actionCreator("UPDATE_POPUP_BG_URL", popupBgUrl);

export const updateCurrencyList = (data: Currency[]) =>
  actionCreator("UPDATE_CURRENCY_LIST", data);

export const updateMakerReloadToggle = (makerReloadToggle: boolean) =>
  actionCreator("UPDATE_MAKER_RELOAD_TOGGLE", makerReloadToggle);

export const updateNextUrl = (nextUrl: string) =>
  actionCreator("UPDATE_NEXT_URL", nextUrl);

export const updateScrollDown = (scrollDown: boolean) =>
  actionCreator("UPDATE_SCROLL_DOWN", scrollDown);
