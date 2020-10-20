// import { Product, PartialProductItem } from "typings/product";
export interface CategoryMenu {
  label: string;
  value: string;
  id?: number;
}

type FilterCategory = {
  id: number;
  name: string;
  url: string;
};
export type CollectionProps = {
  description: string;
  level2Categories: CategoryMenu[];
  selectValue?: FilterCategory[];
};
