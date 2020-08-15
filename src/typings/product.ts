import { ProductID } from "./id";
import { ProductImage } from "./image";
import { PriceRecord } from "./price";
import { Breadcrumb } from "./navigation";
import { BasketStockRecord } from "./basket";

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
  productClass: string;
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
  sizeChartHtml?: string;
  loyalityDisabled?: boolean;
  designJournalTagging?: DesignJournalTag[];
  fillerMessage: string;
  collectionProducts?: CollectionProductItem[];
  groupedProducts?: GroupedProductItem[];
}

export interface PartialChildProductAttributes {
  sku: string;
  priceRecords: PriceRecord;
  stock: number;
  size: string;
  color?: string[];
}

export interface ChildProductAttributes extends PartialChildProductAttributes {
  discountedPriceRecords: PriceRecord;
  id: ProductID;
  isBridalProduct: boolean;
}

export type ProductAttributes = {
  name: string;
  value: string;
};

export type CollectionProductItem = {
  id: string;
  title: string;
  url: string;
  image: string;
  badgeImage: string;
  collection: string;
  collectionUrl: string;
  priceRecords: PriceRecord;
  gaVariant?: string;
};

export interface BasketProduct extends PartialProductItem {
  stockRecords: BasketStockRecord[];
  inWishlist: boolean;
  structure: string;
  parent: ProductID;
  attributes: ProductAttributes[];
}

export interface GroupedProductItem {
  url: string;
  id: ProductID;
  title: string;
  images: ProductImage[];
  color: string[];
}
