// import { string } from "prop-types"

export type List = {
  text: string;
  link: string;
};

export type FooterList = {
  name: string;
  value: List[];
};

export type FooterState = {
  isOpened: boolean;
  currentIndex: number;
  dropdown: boolean;
  hideImage: boolean;
  newsletterEmail: string;
  newsletterMessage: string;
  showCookie: boolean;
};

export type ShopLocations = { label: string; value: string }[];

export type FooterDataProps = {
  footerList: FooterList[];
  footerPlaylistData: {
    ctaImage: string;
    ctaText: string;
    ctaUrl: string;
  };
  shopLocations: ShopLocations;
};
export type FooterProps = {
  data: FooterDataProps;
  mobile: boolean;
  isLoggedIn: boolean;
  saleStatus?: boolean;
};

export type ShopLocatorProps = {
  goToShopLocator: (
    e: React.MouseEvent,
    data: { label: string; value: string } | null
  ) => void;
  saleStatus?: boolean;
  dropdown?: boolean;
  onChangeText: (event: React.KeyboardEvent) => void;
  shopLocations: ShopLocations;
};
