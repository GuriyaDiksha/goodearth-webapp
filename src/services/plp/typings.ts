import { PlpProps } from "containers/plp/typings";

export type PlpResponse = {
  data: PlpProps;
};

type PlpTemplateType = "ProductBanner" | "Product" | "Banner";
type mediaType = "image" | "video";

export type PlpTemplate = {
  template: PlpTemplateType;
  desktopMediaUrl?: string;
  mediaUrl?: string;
  mobileMediaUrl?: string;
  mediaType: mediaType;
  heading: string;
  body?: string;
  placement?: string;
};
export type PlpTemplatesData = {
  categoryShop: string;
  templates: PlpTemplate[];
};
