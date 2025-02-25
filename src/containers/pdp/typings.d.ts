// import { Product, PartialProductItem } from "typings/product";
import { ChildProductAttributes } from "typings/product";

export type Props = {
  slug: string;
  url: string;
};

export type State = {
  sidebarSticky: boolean;
  detailsSticky: boolean;
  activeImage: number;
  detailStickyEnabled: boolean;
  mounted: boolean;
  showLooks: boolean;
  showAddToBagMobile: boolean;
  showSecondary: boolean;
  goToIndex: any;
  loaded: boolean;
  imageHover?: boolean;
  showDock?: boolean;
  selectedSize?: ChildProductAttributes | null;
  pdpButton?: JSX.Element | null;
  shopShopLookPopup?: boolean;
};
export interface Settings {
  dots: boolean;
  infinite: boolean;
  speed: number;
  slidesToShow: number;
  slidesToScroll: number;
  arrow: boolean;
}
