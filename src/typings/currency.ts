export type Currency = "USD" | "INR" | "GBP" | "AED";

export const currencyCode: { [x in Currency]: any } = {
  INR: [8377],
  USD: [36],
  GBP: [163],
  AED: [1583, 46, 1573]
};
