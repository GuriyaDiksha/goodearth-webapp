import * as Actions from "actions/checkout";
import { ActionType } from "typings/actionCreator";
import { BalanceProps } from "containers/myAccount/components/Balance/typings";

export type State = {
  giftcardData: BalanceProps[];
};

export { Actions };

export type GiftActions = ActionType<typeof Actions>;
