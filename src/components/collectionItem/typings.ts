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
}

export type CollectionDataProps = {
  data: CollectionItem;
  setting: Settings;
};
