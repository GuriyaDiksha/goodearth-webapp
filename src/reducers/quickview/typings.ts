import { ProductID } from "typings/id";
import * as Actions from "actions/quickview";
import { ActionType } from "typings/actionCreator";

export type State = {
  quickviewId: ProductID;
};

export type QuickviewtActions = ActionType<typeof Actions>;
