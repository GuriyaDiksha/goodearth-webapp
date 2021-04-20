import * as Actions from "actions/header";
import { ActionType } from "typings/actionCreator";
import {
  HeaderData,
  AnnouncementBar,
  MegaMenuData
} from "components/header/typings";

export type HeaderState = {
  data: HeaderData[];
  megaMenuData: MegaMenuData[];
  announcementData: AnnouncementBar;
};

export type HeaderActions = ActionType<typeof Actions>;
