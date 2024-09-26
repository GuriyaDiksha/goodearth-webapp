import { Location } from "history";
import { Currency } from "../../typings/currency";
import { Basket } from "typings/basket";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";
import { PopupData } from "typings/api";

export interface Childern {
  url: string;
  labelMobile: string;
  id: number;
  labelDesktop: string;
  name: string;
}
export interface MenuData {
  name: string;
  url: string;
  id: number;
  labelDesktop: string;
  labelMobile: string;
  children: Childern[];
}

export interface HeaderData {
  id: number;
  name: string;
  url: string;
  labelDesktop?: string;
  labelMobile?: string;
  catLandingUrl: string;
  leftMenu?: MenuData[];
  rightMenu?: MenuData[][];
  categoryLogoImage?: string | null;
  image?: string;
  categoryImageUrl: string;
  templates?: MenuTemplates[];
}

export type MenuComponentL2L3Data = {
  text: string;
  link: string;
  ctaName: string;
  src?: string;
  thumbnailSrc: string;
  ctaMobile?: string;
  viewAllLink?: string;
  openInNewTab?: boolean;
};

export type MenuComponentTitleData = {
  title: string;
  link: string;
  ctaName: string;
  src?: string;
  openInNewTab?: boolean;
  thumbnailSrc: string;
};

export type MenuComponentImageData = {
  src: string;
  thumbnailSrc: string;
  heading: string;
  subHeading: string;
  link: string;
  openInNewTab?: boolean;
  ctaName?: string;
};
export interface MenuComponent {
  componentType: string;
  componentData:
    | MenuComponentL2L3Data
    | MenuComponentTitleData
    | MenuComponentImageData;
  children?: MenuComponent[];
}
export interface MenuTemplates {
  labelOnMobile?: string;
  publishOnMobile: boolean;
  templateType: string;
  templateData: MenuComponent;
  hideViewAllOnMobile?: boolean;
}
export interface MenuColumn {
  separator: boolean;
  templates: MenuTemplates[];
}
export interface MegaMenuData {
  columns: MenuColumn[];
  text: string;
  url: string;
  openInNewTab?: boolean;
}

export interface InnerMenuData {
  openInNewTab?: boolean;
  text: string;
  url: string;
  l2MenuData: L2MenuData[];
  templates: MenuTemplates[];
}

export interface L2MenuData {
  text: string;
  link: string;
  ctaName?: string;
  ctaMobile?: string;
  viewAllLink?: string;
  hideViewAllOnMobile?: boolean;
  children?: L2MenuData[];
  templateType?: string;
  openInNewTab?: boolean;
}

type Redirection = "OPEN_A_POP_UP" | "OPEN_A_NEW_PAGE" | null;

export type AnnouncementBar = {
  bgColorcode: string;
  bridalBgColorcode: string;
  isBridalActive: boolean;
  registrantName?: string;
  occasionName?: string;
  coRegistrantName?: string;
  registryName?: string;
  data: {
    label: string;
    content: string;
    announcementRedirection: Redirection;
    announcementRedirectionUrl: string;
    announcementRedirectionPopup: PopupData | "";
    ctaRedirection: Redirection;
    ctaRedirectionUrl: string;
    ctaRedirectionPopup: PopupData | "";
    ctaLabel: string;
    ctaBorderColor: string;
    bgColorcode: string;
    DesktopPatternImage: string;
    patternRepeat: boolean;
    mobilePatternImage: string;
  }[];
};

export type WishListType = {
  id: number;
  quantity: number;
  dndSequence: number;
  size?: string | undefined;
  sequence: number;
  productId: number;
};

export type HeaderProps = {
  data: HeaderData[];
  currency: Currency;
  mobile: boolean;
  isLoggedIn: boolean;
  wishlistData: WishListType[];
  cart: Basket;
};

export type SideMenuProps = {
  onSideMenuClick: (clickType: string) => void;
  currency: Currency;
  mobile: boolean;
  wishlistData?: WishListType[];
  wishlistCountData: number;
  sidebagData: Basket;
  toggleSearch: () => void;
  showSearch: boolean;
  showBag: boolean;
  setShowBag: (showBag: boolean) => void;
  hideSearch: () => void;
  bridalCountData: number;
};

export type BottomMenuProps = {
  wishlistCount: number;
  showMenu: boolean;
  clickToggle: () => void;
  isLoggedIn: boolean;
  showSearch: () => void;
  isSearch: boolean;
  showBag: boolean;
  setShowBag: (showBag: boolean) => void;
  bagCount: number;
  onBottomMenuClick?: (clickType: string) => void;
  currencyList: any[];
  currency: Currency;
};

export interface MouseParameter {
  show: boolean;
  activeIndex?: number;
}

export type MenuProps = {
  show: boolean;
  ipad: boolean;
  onMouseOver: (value: MouseParameter) => void;
  data: HeaderData[];
  currency?: Currency;
  mobile?: boolean;
  location: Location;
};

export type MegaMenuProps = {
  activeIndex: number;
  show: boolean;
  ipad: boolean;
  mouseOver: (data: { show: boolean; activeIndex: number }) => void;
  data: MegaMenuData[];
  currency?: Currency;
  mobile?: boolean;
  location: Location;
  hideSearch: () => void;
  onMegaMenuClick: ({
    l1,
    l2,
    l3,
    clickUrl1,
    clickUrl2,
    clickUrl3,
    template,
    img2,
    img3,
    cta,
    subHeading
  }: {
    [x: string]: string;
  }) => void;
};

export type MenuListProps = {
  activeIndex: number;
  mouseOut: (value: MouseParameter) => void;
  menudata: HeaderData[];
  show?: boolean;
  currency?: Currency;
  mobile?: boolean;
  ipad: boolean;
  onHeaderMenuClick: (l1: string, l2: string, l3: string) => void;
};

export type MegaMenuListProps = {
  activeIndex: number;
  myIndex: number;
  mouseOut: (data: { show: boolean }) => void;
  menudata: MegaMenuData;
  show?: boolean;
  currency?: Currency;
  mobile?: boolean;
  ipad: boolean;
  onHeaderMegaMenuClick: ({
    l1,
    l2,
    l3,
    clickUrl1,
    clickUrl2,
    clickUrl3,
    template,
    img2,
    img3,
    cta,
    subHeading
  }: {
    [x: string]: string;
  }) => void;
};

export type MobileListProps = {
  megaMenuData: MegaMenuData[];
  location: Location;
  clickToggle: () => void;
  onMobileMenuClick: ({
    l1,
    l2,
    l3,
    clickUrl1,
    clickUrl2,
    clickUrl3
  }: {
    [x: string]: string;
  }) => void;
  onHeaderMegaMenuClick: ({
    l1,
    l2,
    l3,
    clickUrl1,
    clickUrl2,
    clickUrl3,
    template,
    img2,
    img3,
    cta,
    subHeading
  }: {
    [x: string]: string;
  }) => void;
  wishlistCount: number;
  changeCurrency: (cur: any) => void;
  showCurrency: () => void;
  showC: boolean;
  profileItems: DropdownItem[];
  loginItem: DropdownItem;
  goLogin: (e?: React.MouseEvent) => void;
};
export interface State {
  show: boolean;
  showMenu: boolean;
  showSearch: boolean;
  showC: boolean;
  showP: boolean;
  urlParams: object;
  activeIndex: number;
  selectedPincode: string | null;
  showPincodePopup: boolean;
  showBag: boolean;
  showCartMobile: boolean;
  isLoading: boolean;
  reloadAnnouncementBar: boolean;
  isPlpPage: boolean;
}

export interface MenuState {
  selectedCategory: number;
}

export interface MobileState {
  activeindex: number;
  showmenulevel1: boolean;
  showmenulevel2: boolean;
  activeindex2: number;
  activeindex3: number;
  showmenulevel3: boolean;
  showInnerMenu: boolean;
}

export type SearchFeaturedData = {
  name: string;
  description: string;
  widgetImages: WidgetImage[];
  backgroundImage: string;
  enabled: boolean;
  products: [];
  id: number;
};

export type WidgetImage = {
  image: null;
  imageType: number;
  bannerType: number;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  ctaImage: string;
  ctaText: string;
  ctaUrl: string;
  videoUrl: string;
  urlDisplayName: string;
  order: number;
};

export type SaleTimerData = {
  currency: Currency;
  saleStartDate: string;
  saleEndDate: string;
  text: string;
  ctaText: string;
  ctaUrl: string;
  // themeColorHexCode: string | null;
  themeColorHexCode: string;
};
