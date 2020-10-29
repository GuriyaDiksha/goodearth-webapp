import * as Actions from "actions/info";
import { ActionType } from "typings/actionCreator";

export type State = {
  isSale: boolean;
  popupBgUrl: string;
  currencyList:any[];
};

export type InfoActions = ActionType<typeof Actions>;
