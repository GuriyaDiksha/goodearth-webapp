import * as Actions from "actions/growlMessage";
import { ReactElement } from "react";
import { ActionType } from "typings/actionCreator";

export type GrowlMessageState = {
  text: string | (string | JSX.Element)[] | ReactElement;
  timeout: number;
  id: string;
}[];

export type GrowlMessageActions = ActionType<typeof Actions>;
