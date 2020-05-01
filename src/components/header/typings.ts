import { Currency } from "../../typings/currency";
import { Basket } from "typings/basket";

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
}

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
  currency: Currency;
  mobile: boolean;
  isLoggedIn: boolean;
  wishlistData: WishListType[];
  sidebagData: Basket;
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
};

export type MenuListProps = {
  activeIndex: number;
  mouseOut: (value: MouseParameter) => void;
  menudata: HeaderData[];
  show?: boolean;
  currency?: Currency;
  mobile?: boolean;
  ipad: boolean;
};

export type MobileListProps = {
  menudata: HeaderData[];
};
export interface State {
  show: boolean;
  showMenu: boolean;
  showSearch: boolean;
  showC: boolean;
  showP: boolean;
  urlParams: object;
  activeIndex: number;
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
}
