import { PriceRecord } from "../../typings/price";

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

export interface InnerSetting {
  dots: boolean;
  arrows: boolean;
}

export interface Responses {
  breakpoint?: number;
  settings: InnerSetting;
}

export interface Settings {
  dots: boolean;
  infinite: boolean;
  speed: number;
  responsive: Responses[];
  slidesToShow: number;
  slidesToScroll: number;
  initialSlide: number;
}

export type MoreCollectionData = {
  data: MoreCollectionItem[];
  setting: Settings;
};
