// import { Product, PartialProductItem } from "typings/product";
export interface CategoryMenu {
  label: string;
  value: string;
}

export type CategoryProps = {
  name: string;
  description: string;
  widgetImages: any[];
  backgroundImage: string;
  enabled: boolean;
  products: any[];
  id: number;
};
