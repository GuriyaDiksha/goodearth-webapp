import { PriceRecord } from "../../typings/price";
import { Currency } from "../../typings/currency";
import { Settings } from "react-slick";
import { ProductID } from "typings/id";

export interface RecommendData {
  collectionName: string;
  productUrl: string;
  productImage: string;
  productName: string;
  badgeImage?: string;
  pricerecords: PriceRecord;
  id: ProductID;
  badgeType?: string;
  discount: boolean;
  discountedPriceRecords: PriceRecord;
  altText: string;
}

export type RecommenedSliderProps = {
  data: RecommendData[];
  setting: Settings;
  currency: Currency;
  recommendedProducts: any;
  mobile?: boolean;
  isSale: boolean;
  corporatePDP?: boolean;
};
