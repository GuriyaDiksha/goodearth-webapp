import { actionCreator } from "utils/actionCreator";
import { Product, PartialProductItem, PLPProductItem } from "typings/product";
import { ProductID } from "typings/id";

export const updateProduct = (product: Product<PartialProductItem>) =>
  actionCreator("UPDATE_PRODUCT", product);

export const updatePartialProducts = (
  id: ProductID,
  products: PartialProductItem[]
) => actionCreator("UPDATE_PARTIAL_PRODUCTS", { id, products });

export const updatePlpProduct = (product: PLPProductItem) =>
  actionCreator("UPDATE_PLP_PRODUCT", product);
