// import { PriceRecord } from "../../typings/price";
import { Currency } from "../../typings/currency";
import { Settings } from "react-slick";
import { ProductID } from "typings/id";

export interface PeopleRecommend {
  badgeImage?: string;
  id: ProductID;
  url: string;
  image: string;
  title: string;
  collection: string | null;
  categories: string[];
  sku: string;
  gaVariant: string;
  discount: boolean;
  country: string;
}

export type RecommenedSliderProps = {
  data: PeopleRecommend[];
  setting: Settings;
  currency?: Currency;
  mobile?: boolean;
};
