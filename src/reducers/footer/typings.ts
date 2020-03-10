import * as Actions from "../../actions/footer";
import { ActionType } from "../../typings/actionCreator";
import { FooterDataProps } from "../../components/footer/typings";

export type FooterState = {
  data: FooterDataProps;
};

export type DeviceActions = ActionType<typeof Actions>;
