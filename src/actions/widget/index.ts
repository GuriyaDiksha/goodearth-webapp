import { RegionDetail, WidgetDetail } from "services/widget/typings";
import { actionCreator } from "utils/actionCreator";

export const updateRegion = (data: RegionDetail) =>
  actionCreator("UPDATE_REGION", data);

export const updateWidgetDetail = (data: WidgetDetail) =>
  actionCreator("UPDATE_WIDGET_DETAIL", data);

export const updateConsentDetail = (data: string) =>
  actionCreator("UPDATE_CONSENT_DETAIL", data);
