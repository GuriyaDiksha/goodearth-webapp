export type Currency = "USD" | "INR" | "GBP" | "AED" | "SGD";

// Flag to control the inclusion of AED
export const isAEDDisabled = false;

// Define the type with optional AED based on the flag
type CurrencyCode = {
  USD: number[];
  INR: number[];
  GBP: number[];
  SGD: number[];
  AED?: number[]; // AED is optional
};

export const currencyCode: CurrencyCode = {
  INR: [8377],
  USD: [36],
  GBP: [163],
  ...(!isAEDDisabled ? { AED: [65, 69, 68] } : {}),
  SGD: [83, 36]
};
