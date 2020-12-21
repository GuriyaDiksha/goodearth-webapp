import * as Actions from "actions/info";
import { ActionType } from "typings/actionCreator";

export type State = {
  isSale: boolean;
  popupBgUrl: string;
  currencyList: any[];
  makerReloadToggle: boolean;
  nextUrl: string;
};

export type InfoActions = ActionType<typeof Actions>;
