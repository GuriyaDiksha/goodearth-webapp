export type Currency = "USD" | "INR" | "GBP" | "AED" | "SGD";

export const currencyCode: { [x in Currency]: any } = {
  INR: [8377],
  USD: [36],
  GBP: [163],
  AED: [65, 69, 68],
  SGD: [83, 36]
};
