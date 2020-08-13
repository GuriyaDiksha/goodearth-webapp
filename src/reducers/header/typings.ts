import * as Actions from "actions/header";
import { ActionType } from "typings/actionCreator";
import { HeaderData, AnnouncementBar } from "components/header/typings";

export type HeaderState = {
  data: HeaderData[];
  announcementData: AnnouncementBar;
};

export type HeaderActions = ActionType<typeof Actions>;
