export type Currency = "USD" | "INR" | "GBP" | "AED";

export const currencyCode: { [x in Currency]: number } = {
  INR: 8377,
  USD: 36,
  GBP: 163,
  AED: 244.7
};
