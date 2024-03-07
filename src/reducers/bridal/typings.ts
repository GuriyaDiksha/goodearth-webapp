import * as Actions from "actions/bridal";
import { ActionType } from "typings/actionCreator";

export type State = {
  count: number;
};

export { Actions };

export type BridalActions = ActionType<typeof Actions>;
