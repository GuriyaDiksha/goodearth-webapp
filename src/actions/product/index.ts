import { actionCreator } from "utils/actionCreator";
import { Product, PartialProductItem, PLPProductItem } from "typings/product";

export const updateProduct = (product: Product<PartialProductItem>) =>
  actionCreator("UPDATE_PRODUCT", product);

export const updatePartialProduct = (product: PartialProductItem) =>
  actionCreator("UPDATE_PARTIAL_PRODUCT", product);

export const updatePlpProduct = (product: PLPProductItem) =>
  actionCreator("UPDATE_PLP_PRODUCT", product);
