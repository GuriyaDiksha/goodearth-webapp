import { Location } from "history";
import { Currency } from "../../typings/currency";
import { Basket } from "typings/basket";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";

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
};

export type MenuComponentTitleData = {
  title: string;
  link: string;
  ctaName: string;
  src?: string;
  thumbnailSrc: string;
};

export type MenuComponentImageData = {
  src: string;
  thumbnailSrc: string;
  heading: string;
  subHeading: string;
  link: string;
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
  publishOnMobile: boolean;
  templateType: string;
  templateData: MenuComponent;
}
export interface MenuColumn {
  separator: boolean;
  templates: MenuTemplates[];
}
export interface MegaMenuData {
  columns: MenuColumn[];
  text: string;
  url: string;
}

export interface InnerMenuData {
  text: string;
  url: string;
  l2MenuData: L2MenuData[];
  templates: MenuTemplates[];
}

export interface L2MenuData {
  text: string;
  link: string;
  ctaName?: string;
  children?: L2MenuData[];
}

export type AnnouncementBar = {
  url: number | null;
  message: string;
  bgColorcode: string;
  bridalBgColorcode: string;
  isBridalActive: boolean;
  registrantName?: string;
  coRegistrantName?: string;
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
  wishlistData: WishListType[];
  sidebagData: Basket;
  toggleSearch: () => void;
  showSearch: boolean;
  showBag: boolean;
  setShowBag: (showBag: boolean) => void;
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
  show: boolean;
  ipad: boolean;
  onMouseOver: (value: MouseParameter) => void;
  data: MegaMenuData[];
  currency?: Currency;
  mobile?: boolean;
  location: Location;
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
  mouseOut: (value: MouseParameter) => void;
  menudata: MegaMenuData[];
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
  menudata: HeaderData[];
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

export type Menu = {
  results: HeaderData[];
  megaMenuResults: MegaMenuData[];
};
