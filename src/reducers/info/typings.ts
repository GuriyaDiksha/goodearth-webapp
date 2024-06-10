import * as Actions from "actions/info";
import { ActionType } from "typings/actionCreator";

export type State = {
  isSale: boolean;
  popupBgUrl: string;
  currencyList: any[];
  makerReloadToggle: boolean;
  nextUrl: string;
  deliveryText: string;
  scrollDown: boolean;
  microUrl: string;
  showCookie: boolean;
  showTimer: boolean;
  showGiftWrap: boolean;
  showDeliveryInstruction: boolean;
  showPromo: boolean;
  isLoading: boolean;
  isCheckoutLoading: boolean;
  showCookiePref: boolean;
  showShipping?: boolean;
  isLoyaltyFilterOpen?: boolean;
  openCookiePopup?: boolean;
};

export type InfoActions = ActionType<typeof Actions>;
