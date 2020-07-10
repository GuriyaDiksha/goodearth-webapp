import * as Actions from "actions/shop";

import { ActionType } from "typings/actionCreator";

export { Actions };
export type State = {
  shopData: any[];
};
export type ShopActions = ActionType<typeof Actions>;
