import * as Actions from "actions/header";
import { ActionType } from "typings/actionCreator";
import {
  HeaderData,
  AnnouncementBar,
  MegaMenuData,
  SaleTimerData
} from "components/header/typings";

export type HeaderState = {
  data: HeaderData[];
  megaMenuData: MegaMenuData[];
  announcementData: AnnouncementBar;
  timerData: null | SaleTimerData;
};

export type HeaderActions = ActionType<typeof Actions>;
