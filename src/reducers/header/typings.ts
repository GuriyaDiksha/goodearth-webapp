import * as Actions from "actions/header";
import { ActionType } from "typings/actionCreator";
import { HeaderData } from "components/header/typings";

export type HeaderState = {
  data: HeaderData[];
};

export type DeviceActions = ActionType<typeof Actions>;
