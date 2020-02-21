import { Settings } from "react-slick";
import { CollectionProductItem } from "typings/product";

export type MoreCollectionItem = CollectionProductItem;

export type MoreCollectionSliderProps = {
  data: MoreCollectionItem[];
  setting: Settings;
};
