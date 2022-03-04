import * as Actions from "actions/header";
import { ActionType } from "typings/actionCreator";
import {
  AnnouncementBar,
  MegaMenuData,
  SaleTimerData
} from "components/header/typings";

export type StoreData = {
  data: any[];
  visible: boolean;
};

export type SizeChartResponse = {
  fitGuide: {
    image: string;
    pointers: string[];
  };
  sizeGuide: {
    data: number[][];
    measurements: string[];
    sizes: string[];
  };
};
export type SizeChartData = {
  data: SizeChartResponse;
  show: boolean;
};

export type HeaderState = {
  megaMenuData: MegaMenuData[];
  announcementData: AnnouncementBar;
  timerData: null | SaleTimerData;
  storeData: StoreData;
  sizeChartData: SizeChartData;
};

export type HeaderActions = ActionType<typeof Actions>;
