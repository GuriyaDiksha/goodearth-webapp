import { actionCreator } from "utils/actionCreator";
import {
  AnnouncementBar,
  MegaMenuData,
  SaleTimerData
} from "components/header/typings";
import { SizeChartResponse } from "reducers/header/typings";
import { ChildProductAttributes } from "typings/product";

export const updateheader = (data: MegaMenuData[]) =>
  actionCreator("UPDATE_HEADER", data);

export const updateAnnouncement = (data: AnnouncementBar) =>
  actionCreator("UPDATE_ANNOUNCEMENT_BAR", data);

export const updateTimerData = (data: SaleTimerData) =>
  actionCreator("UPDATE_TIMER_DATA", data);

export const updateStore = (data: any) =>
  actionCreator("UPDATE_STORE_DATA", data);

export const updateStoreState = (data: boolean) =>
  actionCreator("UPDATE_STORE_STATE", data);

export const updateSizeChartData = (data: SizeChartResponse) =>
  actionCreator("UPDATE_SIZE_CHART_DATA", data);

export const updateSizeChartShow = (data: boolean) =>
  actionCreator("UPDATE_SIZE_CHART_SHOW", data);

export const updateSizeChartSizes = (data: {
  sizes: ChildProductAttributes[];
  isCorporatePDP: boolean;
}) => actionCreator("UPDATE_SIZE_CHART_SIZES", data);

export const updateSizeChartSelected = (data: number | undefined) =>
  actionCreator("UPDATE_SIZE_CHART_SELECTED", data);
