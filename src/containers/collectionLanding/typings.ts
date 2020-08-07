// import { Product, PartialProductItem } from "typings/product";
export interface CategoryMenu {
  label: string;
  value: string;
}

export type CollectionProps = {
  description: string;
  level2Categories: CategoryMenu[];
  selectValue?: any;
};
