import * as Actions from "actions/device";
import { ActionType } from "typings/actionCreator";

export type State = {
  mobile: boolean;
  tablet: boolean;
};

export type DeviceActions = ActionType<typeof Actions>;
