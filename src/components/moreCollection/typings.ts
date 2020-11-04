import { Settings } from "react-slick";
import { Currency } from "typings/currency";
import { CollectionProductItem } from "typings/product";

export type MoreCollectionItem = CollectionProductItem;

export type MoreCollectionSliderProps = {
  data: MoreCollectionItem[];
  setting: Settings;
  mobile?: boolean;
  currency?: Currency;
};
