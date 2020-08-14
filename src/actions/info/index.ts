import { actionCreator } from "utils/actionCreator";

export const updateCurrency = (isSale: boolean) =>
  actionCreator("UPDATE_SALE", isSale);
