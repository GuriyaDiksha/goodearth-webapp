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
  collSliderimage?: string[];
  header?: string;
  url?: string;
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
}

export type CollectionData = {
  data: CollectionItem;
  setting: Settings;
};
