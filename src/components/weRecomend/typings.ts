import { PriceRecord } from "../../typings/price";
import { Currency } from "../../typings/currency";
import { Settings } from "react-slick";

export interface RecommendData {
  collectionName: string;
  productUrl: string;
  productImage: string;
  productName: string;
  badgeImage?: string;
  sku: string;
  title: string;
  collectionUrl?: string;
  pricerecords: PriceRecord;
}

export type RecommenedSliderProps = {
  data: RecommendData[];
  setting: Settings;
  currency: Currency;
};
