import * as Actions from "actions/giftcard";
import { ActionType } from "typings/actionCreator";
import { BalanceProps } from "containers/myAccount/components/Balance/typings";

export type State = {
  data: BalanceProps[];
};

export { Actions };

export type GiftActions = ActionType<typeof Actions>;
