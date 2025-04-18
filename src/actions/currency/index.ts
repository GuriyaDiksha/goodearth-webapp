import { actionCreator } from "utils/actionCreator";
import { Currency } from "typings/currency";

export const updateCurrency = (currency: Currency) =>
  actionCreator("UPDATE_CURRENCY", currency);
