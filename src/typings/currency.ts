import { currency } from "reducers/currency";

export type Currency = "USD" | "INR" | "GBP";

export const currencyCode: { [x in Currency]: number } = {
  INR: 8377,
  USD: 36,
  GBP: 163
};
