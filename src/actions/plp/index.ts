import { actionCreator } from "utils/actionCreator";
// import {
//   Product,
//   PartialProductItem,
//   PLPProductItem
// } from "typings/product";

import { PlpProps } from "containers/plp/typings";

export const updateProduct = (plpList: PlpProps) =>
  actionCreator("ADD_PLP_LIST", plpList);

export const newPlpList = (plpList: PlpProps) =>
  actionCreator("NEW_PLP_LIST", plpList);

export const updateFacets = (data: any) => actionCreator("UPDATE_FACET", data);

export const updateFilterState = (data: boolean) =>
  actionCreator("UPDATE_FILTER", data);

export const updateFilterData = (data: string) =>
  actionCreator("UPDATE_FILTER_DATA", data);
