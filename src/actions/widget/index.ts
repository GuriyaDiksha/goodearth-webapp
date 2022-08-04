import { WidgetDetail } from "services/widget/typings";
import { actionCreator } from "utils/actionCreator";

export const updateRegion = (region: string) =>
  actionCreator("UPDATE_REGION", region);

export const updateWidgetDetail = (data: WidgetDetail) =>
  actionCreator("UPDATE_WIDGET_DETAIL", data);
