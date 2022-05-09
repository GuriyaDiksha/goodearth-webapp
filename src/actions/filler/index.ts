import { actionCreator } from "utils/actionCreator";
import { Product, PartialProductItem } from "typings/product";

export const updatefillerProduct = (products: Product<PartialProductItem>) =>
  actionCreator("UPDATE_FILLER_PRODUCT", products);

export const updateshowFiller = (value: boolean) =>
  actionCreator("UPDATE_FILLER", value);
