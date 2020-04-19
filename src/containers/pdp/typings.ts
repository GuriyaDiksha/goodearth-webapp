// import { Product, PartialProductItem } from "typings/product";

export type Props = {
  slug: string;
  url: string;
};

export type State = {
  sidebarSticky: boolean;
  detailsSticky: boolean;
  activeImage: number;
  detailStickyEnabled: boolean;
};
