import * as Actions from "actions/widget";
import { WidgetDetail } from "services/widget/typings";
import { ActionType } from "typings/actionCreator";

export type State = {
  region: string;
  widgetDetail: WidgetDetail | null;
};

export { Actions };

export type WidgetActions = ActionType<typeof Actions>;
