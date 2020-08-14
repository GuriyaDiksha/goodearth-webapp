import * as Actions from "actions/info";
import { ActionType } from "typings/actionCreator";

export type State = {
  isSale: boolean;
};

export type InfoActions = ActionType<typeof Actions>;
