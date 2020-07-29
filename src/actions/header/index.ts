import { actionCreator } from "utils/actionCreator";
import { HeaderData, AnnouncementBar } from "components/header/typings";

export const updateheader = (data: HeaderData[]) =>
  actionCreator("UPDATE_HEADER", data);

export const updateAnnouncement = (data: AnnouncementBar) =>
  actionCreator("UPDATE_ANNOUNCEMENT_BAR", data);
