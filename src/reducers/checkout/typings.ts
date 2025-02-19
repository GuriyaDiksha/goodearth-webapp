import * as Actions from "actions/checkout";
import { ActionType } from "typings/actionCreator";
import { BalanceProps } from "containers/myAccount/components/Balance/typings";
import { GC_CN_AmountResponse } from "containers/myAccount/components/MyCreditNotes/typings";

export type State = {
  giftcardData: BalanceProps[];
  GCCNData: GC_CN_AmountResponse;
};

export { Actions };

export type GiftActions = ActionType<typeof Actions>;
