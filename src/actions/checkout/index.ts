import { actionCreator } from "utils/actionCreator";
import { BalanceProps } from "containers/myAccount/components/Balance/typings";
import { GC_CN_AmountResponse } from "containers/myAccount/components/MyCreditNotes/typings";

export const giftcardBalance = (basket: BalanceProps) =>
  actionCreator("GET_GIFTCARD", basket);

export const update_GC_CN_Amount = (data: GC_CN_AmountResponse) =>
  actionCreator("UPDATE_GCCNAMOUNT", data);
