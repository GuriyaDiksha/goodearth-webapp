import { ProductID } from "./id";
import { ProductImage } from "./image";
import { PriceRecord } from "./price";
import { Breadcrumb } from "./navigation";
import { BasketStockRecord } from "./basket";
import { SizeChartResponse } from "reducers/header/typings";

export interface PLPProductItem {
  url: string;
  id: ProductID;
  title: string;
  collection?: string;
  collections: string[];
  plpImages?: string[];
  priceRecords: PriceRecord;
  discountedPriceRecords: PriceRecord;
  discount: boolean;
  categories: string[];
  isNew?: boolean;
  salesBadgeImage?: string;
  justAddedBadge?: string;
  badgeType?: string;
  partial: boolean;
  markAs?: string[];
  productClass: string;
  inStock?: boolean;
  childAttributes?: PartialChildProductAttributes[] | ChildProductAttributes[];
  plpSliderImages: string[];
  lookImageUrl?: string;
  images?: ProductImage[];
  sliderImages?: ProductImage[];
  invisibleFields: string[];
  partner?: string;
  altText: string;
  groupedProductsCount: number;
}

export interface PartialProductItem extends PLPProductItem {
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
  loyaltyDisabled?: boolean;
  designJournalTagging?: DesignJournalTag[];
  fillerMessage: string;
  collectionProducts?: CollectionProductItem[];
  pairItWithProducts?: PLPProductItem[];
  looksProducts?: PLPProductItem[];
  lookImageUrl?: string;
  groupedProducts?: GroupedProductItem[];
  showFillerMessage?: boolean;
  fillerUrl?: string;
  complianceLine?: string;
  manufactureInfo: string;
  sizeChart: string | SizeChartResponse;
  badgeMessage?: string;
  fillerProduct: PartialProductItem | any;
  shortDesc: string | null;
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
  othersBasketCount: number;
  showStockThreshold: boolean;
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
  altText: string;
};

export interface BasketProduct extends PartialProductItem {
  stockRecords: BasketStockRecord[];
  childAttributes: ChildProductAttributes[];
  inWishlist: boolean;
  structure: string;
  parent: ProductID;
  attributes: ProductAttributes[];
  productDeliveryDate: string;
}

export interface GroupedProductItem {
  url: string;
  id: ProductID;
  title: string;
  images: ProductImage[];
  color: string[];
}
