import { actionCreator } from "utils/actionCreator";

export const updateSales = (isSale: boolean) =>
  actionCreator("UPDATE_SALE", isSale);
