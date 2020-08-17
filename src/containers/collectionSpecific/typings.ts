// import { Product, PartialProductItem } from "typings/product";
import { PartialProductItem } from "src/typings/product";
import { Breadcrumb } from "typings/navigation";

export interface ImageProps {
  image: string;
  imageType: number;
  bannerType: number;
  title?: string;
  subtitle?: string;
  description?: string;
  url?: string;
  ctaImage?: string;
  ctaText?: string;
  ctaUrl?: string;
  videoUrl?: string;
  urlDisplayName?: string;
  order?: number;
}

export type CollectionSpecificBannerProps = {
  name: string;
  description: string;
  widgetImages: ImageProps[];
  backgroundImage: string;
  enabled: boolean;
  products: PartialProductItem[];
  id: number;
};

export type CollectionSpecificProps = {
  count: number;
  breadcrumbs: Breadcrumb[];
  shortDescription: string;
  longDescription: string;
  results: PartialProductItem[];
  next: any;
};
