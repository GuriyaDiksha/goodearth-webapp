import { Currency } from "typings/currency";

const displayPriceWithCommas = (price: string | number, currency: Currency) => {
  let arg = "";
  if (currency == "INR") {
    arg = "en-IN";
  } else {
    arg = "en-US";
  }
  return parseInt(price.toString()).toLocaleString(arg);
};

export { displayPriceWithCommas };
