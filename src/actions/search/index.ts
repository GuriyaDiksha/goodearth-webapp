import { actionCreator } from "utils/actionCreator";

import { PlpProps } from "containers/search/typings";

export const updateProduct = (plpList: PlpProps) =>
  actionCreator("ADD_SEARCH_LIST", plpList);

export const newSearchList = (plpList: PlpProps) =>
  actionCreator("NEW_SEARCH_LIST", plpList);

export const updateFilterState = (data: boolean) =>
  actionCreator("UPDATE_FILTER", data);

export const updateOnload = (data: boolean) =>
  actionCreator("UPDATE_ONLOAD", data);
