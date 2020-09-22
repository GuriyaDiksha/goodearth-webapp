import { actionCreator } from "utils/actionCreator";

export const updateSales = (isSale: boolean) =>
  actionCreator("UPDATE_SALE", isSale);

export const updatePopupBgUrl = (popupBgUrl: string) =>
  actionCreator("UPDATE_POPUP_BG_URL", popupBgUrl);
