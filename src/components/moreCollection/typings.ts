import { PriceRecord } from "../../typings/price";
import { Settings } from "../../typings/settings";

export interface Category {
  id: number;
  name: string;
}

export interface MoreCollectionItem {
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

export type MoreCollectionData = {
  data: MoreCollectionItem[];
  setting: Settings;
};
