import * as Actions from "actions/header";
import { ActionType } from "typings/actionCreator";
import {
  AnnouncementBar,
  MegaMenuData,
  SaleTimerData
} from "components/header/typings";
import { ChildProductAttributes } from "typings/product";

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
    note: string;
    disclaimer: string;
  };
};
export type SizeChartData = {
  data: SizeChartResponse | string;
  show: boolean;
  sizes: ChildProductAttributes[];
  selected: number | undefined;
  isCorporatePDP: boolean;
};

export type HeaderState = {
  megaMenuData: MegaMenuData[];
  announcementData: AnnouncementBar;
  timerData: null | SaleTimerData;
  storeData: StoreData;
  sizeChartData: SizeChartData;
  mobileMenuOpenState: boolean;
};

export type HeaderActions = ActionType<typeof Actions>;
