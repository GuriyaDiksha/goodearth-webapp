import { actionCreator } from "utils/actionCreator";
import { BalanceProps } from "containers/myAccount/components/Balance/typings";

export const giftcardBalance = (basket: BalanceProps) =>
  actionCreator("GET_GIFTCARD", basket);
