import { actionCreator } from "utils/actionCreator";
import {
  Product,
  PartialProductItem,
  PLPProductItem,
  CollectionProductItem
} from "typings/product";
import { ProductID } from "typings/id";

export const updateProduct = (product: Product<PartialProductItem>) =>
  actionCreator("UPDATE_PRODUCT", product);

export const updatePartialProducts = (products: PartialProductItem[]) =>
  actionCreator("UPDATE_PARTIAL_PRODUCTS", { products });

export const updatePlpProduct = (products: PLPProductItem[]) =>
  actionCreator("UPDATE_PLP_PRODUCT", products);

export const updateCollectionProducts = (
  id: ProductID,
  products: CollectionProductItem[]
) => actionCreator("UPDATE_COLLECTION_PRODUCTS", { id, products });
