import { actionCreator } from "utils/actionCreator";
import {
  HeaderData,
  AnnouncementBar,
  MegaMenuData
} from "components/header/typings";

export const updateheader = (data: {
  results: HeaderData[];
  megaMenuResults: MegaMenuData[];
}) => actionCreator("UPDATE_HEADER", data);

export const updateAnnouncement = (data: AnnouncementBar) =>
  actionCreator("UPDATE_ANNOUNCEMENT_BAR", data);
