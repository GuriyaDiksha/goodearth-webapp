import { ProductID } from "./id";
import { ProductImage } from "./image";
import { PriceRecord } from "./price";
import { Breadcrumb } from "./navigation";

export interface PLPProductItem {
  url: string;
  id: ProductID;
  title: string;
  collections: string[];
  plpImages?: string[];
  priceRecords: PriceRecord;
  discountedPriceRecords: PriceRecord;
  discount: boolean;
  categories: string[];
  isNew?: boolean;
  salesBadgeImage?: string;
  partial: boolean;
  markAs?: string[];
  childAttributes?: PartialChildProductAttributes[] | ChildProductAttributes[];
}

export interface PartialProductItem extends PLPProductItem {
  images?: ProductImage[];
  sku: string;
  gaVariant: string;
  recommendationFinalScore?: number;
}

export type DesignJournalTag = {
  designJournal: boolean;
  folderCode: string;
};

export interface Product<T = ProductID> extends PartialProductItem {
  breadcrumbs: Breadcrumb[];
  details: string;
  compAndCare: string;
  shipping: string;
  sizeFit?: string;
  recommendedProducts: T[];
  productClass: string;
  structure: string;
  parent?: string;
  collectionUrl?: string;
  collection?: string;
  sliderImages: ProductImage[];
  childAttributes: ChildProductAttributes[];
  sizeChartHTML?: string;
  loyalityDisabled?: boolean;
  designJournalTagging?: DesignJournalTag[];
  fillerMessage?: string;
  collectionProducts?: CollectionProductItem[];
}

export interface PartialChildProductAttributes {
  sku: string;
  priceRecords: PriceRecord;
  stock: number;
  size: string;
}

export interface ChildProductAttributes extends PartialChildProductAttributes {
  discountedPriceRecords: PriceRecord;
  id: ProductID;
  isBridalProduct: boolean;
}

export type CollectionProductItem = {
  id: string;
  title: string;
  url: string;
  image: string;
  badgeImage: string;
  collection: string;
  collectionUrl: string;
  priceRecords: PriceRecord;
};
