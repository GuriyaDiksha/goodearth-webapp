import { ProductID } from "./id";
import { ProductImage, ProductSliderImage } from "./image";
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

export interface Product extends PartialProductItem {
  breadcrumbs: Breadcrumb[];
  details: string;
  compAndCare: string;
  shipping: string;
  sizeFit?: string;
  recommendedProducts: PartialProductItem[];
  productClass: string;
  structure: string;
  parent?: string;
  collectionUrl?: string;
  collection?: string;
  sliderImages: ProductSliderImage[];
  childAttributes: ChildProductAttributes[];
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
