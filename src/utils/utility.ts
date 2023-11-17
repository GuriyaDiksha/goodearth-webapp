import { Currency } from "typings/currency";
import { currencyCodes } from "constants/currency";

const displayPriceWithCommas = (
  price: string | number,
  currency: Currency,
  with_symbol: boolean | (() => boolean) = true
) => {
  let arg = "";
  if (currency == "INR") {
    arg = "en-IN";
  } else {
    arg = "en-US";
  }
  const currency_symbol =
    currencyCodes?.[currency]?.length &&
    String.fromCharCode(...currencyCodes[currency]);
  const arr: any[] = [];
  if (price.toString().includes("-") && price.toString()[0] != "-") {
    // When price is of type 1000-2000, any other type will be considered as number
    price
      .toString()
      .split("-")
      .map(e => {
        arr.push(parseInt(e.toString()).toLocaleString(arg));
      });
  } else {
    arr.push(parseInt(price.toString()).toLocaleString(arg));
  }
  return with_symbol
    ? currency_symbol + " " + arr.join(" - " + currency_symbol + " ")
    : arr.join(" - ");
};

const displayPriceWithCommasFloat = (
  price: string | number,
  currency: Currency,
  with_symbol: boolean | (() => boolean) = true
) => {
  let arg = "";
  if (currency == "INR") {
    arg = "en-IN";
  } else {
    arg = "en-US";
  }
  const currency_symbol =
    currencyCodes?.[currency]?.length &&
    String.fromCharCode(...currencyCodes[currency]);
  const arr: any[] = [];
  if (price.toString().includes("-") && price.toString()[0] != "-") {
    price
      .toString()
      .split("-")
      .map(e => {
        arr.push(
          parseFloat(e.toString()).toLocaleString(arg, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })
        );
      });
  } else {
    arr.push(parseFloat(price.toString()).toLocaleString(arg));
  }
  return with_symbol
    ? currency_symbol + " " + arr.join(" - " + currency_symbol + " ")
    : arr.join(" - ");
};

const makeid = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export { displayPriceWithCommas, displayPriceWithCommasFloat, makeid };
