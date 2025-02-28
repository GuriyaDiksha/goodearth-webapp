import { Currency } from "typings/currency";

export const currencyCodes: { [key in Currency]: any } = {
  INR: [8377],
  USD: [36],
  GBP: [163],
  AED: [65, 69, 68],
  SGD: [83, 36]
};

export const countryCurrencyCode = {
  IN: "INR",
  US: "USD",
  GB: "GBP",
  AE: "AED",
  SG: "SGD"
};

export const currentyToCountryMapping = {
  INR: "India",
  SGD: "Singapore",
  AED: "United Arab Emirates",
  GBP: "United Kingdom",
  USD: "United States"
};

export const maximumOtpAttempt = 5;
