import { Settings } from "react-slick";

export interface Category {
  id: number;
  name: string;
}

export interface CollectionItem {
  id: number;
  name: string;
  displayImage?: string | null;
  subHeader?: string;
  shortDescription: string;
  longDescription?: string;
  categoryName?: Category[];
  sliderImages?: string[];
  header?: string;
  url?: string;
  tags: string[];
}

type CollectionTemplateType = "ProductBanner" | "Product" | "Banner";
type mediaType = "image" | "video";

export type CollectionTemplate = {
  template: CollectionTemplateType;
  desktopMediaUrl?: string;
  mediaUrl?: string;
  mobileMediaUrl?: string;
  mediaType: mediaType;
  heading: string;
  body?: string;
  placement?: string;
};

export type CollectionTemplatesData = {
  id: number;
  templates: CollectionTemplate[];
};

export type CollectionDataProps = {
  data: CollectionItem;
  setting: Settings;
};
