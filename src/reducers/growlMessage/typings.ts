import * as Actions from "actions/growlMessage";
import { ActionType } from "typings/actionCreator";

export type GrowlMessageState = {
  text: string;
  timeout?: number;
};

export type GrowlMessageActions = ActionType<typeof Actions>;
