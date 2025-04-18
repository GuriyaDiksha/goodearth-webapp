// import { string } from "prop-types"

export type List = {
  text: string;
  link: string;
  iconImage?: string;
  newTabLink?: string;
};

export type FooterList = {
  name: string;
  value: List[];
  link?: string;
  openInNewTab: boolean;
}[];

export type FooterState = {
  isOpened: boolean;
  currentIndex: number;
  dropdown: boolean;
  hideImage: boolean;
  newsletterEmail: string;
  newsletterMessage: string;
  newsletterError: boolean;
  showPopUp: boolean;
  isInViewport: boolean;
  isConsentSave: boolean;
  headingHoverArray: boolean[];
  subheadingHoverArray: boolean[];
  smartNav: string[];
  country?: string;
  isPromoPopupVisible?: boolean;
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
  footerImages: {
    footerImageDeskTop: string;
    footerImageMobile: string;
    footerImageSubsDeskTop: string;
    footerImageSubsMobile: string;
    footerBgColorDeskTop: string;
    footerBgColorMobile: string;
    footerHeadingFontColor: string;
    footerSubHeadingFontColor: string;
    footerHeadingHoverColor: string;
    footerSubHeadingHoverColor: string;
    sectionContent: string;
    sectionFontColor: string;
    newsletterBgImage: string;
    newsletterBgColor: string;
  };
  findUsOnData: {
    iconImage: string;
    link: string;
  }[];
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
  mobile?: boolean;
  footerHeadingFontColor: string;
  footerHeadingHoverColor: string;
};
