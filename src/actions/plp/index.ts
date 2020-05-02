import { actionCreator } from "utils/actionCreator";
// import {
//   Product,
//   PartialProductItem,
//   PLPProductItem
// } from "typings/product";

import { PlpProps } from "containers/plp/typings";

export const updateProduct = (plpList: PlpProps) =>
  actionCreator("ADD_PLP_LIST", plpList);

export const updateFacets = (data: any) => actionCreator("UPDATE_FACET", data);

// export const updatePartialProducts = (products: PartialProductItem[]) =>
//   actionCreator("UPDATE_PARTIAL_PRODUCTS", { products });

// export const updatePlpProduct = (product: PLPProductItem) =>
//   actionCreator("UPDATE_PLP_PRODUCT", product);
