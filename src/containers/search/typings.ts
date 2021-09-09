// import { Product, PartialProductItem } from "typings/product";
import { Breadcrumb } from "typings/navigation";
import { PartialProductItem } from "typings/product";
// import { DispatchProp } from "react-redux";

export interface CategoryMenu {
  label: string;
  value: string;
}

export type CollectionProps = {
  description: string;
  level2Categories: CategoryMenu[];
};

export interface PlpResult {
  facets: any;
  breadcrumb: Breadcrumb[];
  data: PartialProductItem[];
  banner: string;
  bannerMobile: string;
  bannerUrl: string;
  suggestions: any[];
}

export type PlpProps = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PlpResult;
};

export type FilterProps = {
  setFilterCount?: (count: number) => void;
  onRef: any;
  onChangeFilterState: (data: boolean, cross?: boolean) => void;
  changeLoader?: (data: boolean) => void;
};

export type State = {
  isLoading: boolean;
  showmobileFilterList: boolean;
  filter: any;
  show: false;
  showDifferentImage: boolean;
  showmenulevel2: boolean;
  salestatus: boolean;
  flag: boolean;
  banner: string;
  initialrangevalue: any;
  rangevalue: any;
  searchUrl: any;
  mobileFilter: boolean;
  showmobileSort: boolean;
  showmobileText: string;
  filterUrl: string;
  oldSelectedCategory: any;
  showWishList: boolean;
  disableSelectedbox: boolean;
  scrolllastvalue: number;
  scrollfilterlastvalue: number;
  scrollload: boolean;
  totalItems: number;
  showProductFilter: boolean;
  scrollView: boolean;
  openMenu: number;
  showFilterByDiscountMenu: boolean;
  categoryindex: number;
  activeindex: number;
  activeindex2: string | number;
  categorylevel1: boolean;
  showmenulevel1: boolean;
  shouldScroll: boolean;
};
