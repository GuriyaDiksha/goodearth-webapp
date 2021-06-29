import * as Actions from "actions/growlMessage";
import { ActionType } from "typings/actionCreator";

export type GrowlMessageState = {
  text: string;
  timeout: number;
  id: string;
  params?: any;
}[];

export type GrowlMessageActions = ActionType<typeof Actions>;
