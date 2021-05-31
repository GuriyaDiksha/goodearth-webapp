import { actionCreator } from "utils/actionCreator";
import {
  HeaderData,
  AnnouncementBar,
  MegaMenuData,
  SaleTimerData
} from "components/header/typings";

export const updateheader = (data: {
  results: HeaderData[];
  megaMenuResults: MegaMenuData[];
}) => actionCreator("UPDATE_HEADER", data);

export const updateAnnouncement = (data: AnnouncementBar) =>
  actionCreator("UPDATE_ANNOUNCEMENT_BAR", data);

export const updateTimerData = (data: SaleTimerData) =>
  actionCreator("UPDATE_TIMER_DATA", data);
