import { Settings } from "react-slick";
import { Currency } from "typings/currency";
import { CollectionProductItem, PLPProductItem } from "typings/product";

export type MoreCollectionItem = CollectionProductItem;

export type PairItWithSliderProps = {
  data: PLPProductItem[];
  setting: Settings;
  mobile?: boolean;
  currency: Currency;
};
