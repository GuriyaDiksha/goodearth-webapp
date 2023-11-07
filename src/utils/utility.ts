import { Currency } from "typings/currency";
import { currencyCodes } from "constants/currency";

const displayPriceWithCommas = (
  price: string | number,
  currency: Currency
  // with_symbol: boolean | (() => boolean) = true
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
  price
    .toString()
    .split("-")
    .map(e => {
      arr.push(parseInt(e.toString()).toLocaleString(arg));
    });
  // return with_symbol
  //   ? currency_symbol + " " + arr.join(" - " + currency_symbol + " ")
  //   : arr.join(" - ");
  try {
    return parseInt(price.toString()) < 0
      ? currency_symbol + " " + parseInt(price.toString()).toLocaleString(arg)
      : currency_symbol + " " + arr.join(" - ");
  } catch (err) {
    console.log("err" + err);
    return "";
  }
};

const displayPriceWithCommasFloat = (
  price: string | number,
  currency: Currency
  // with_symbol: boolean | (() => boolean) = true
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
  // return with_symbol
  //   ? currency_symbol + " " + arr.join(" - " + currency_symbol + " ")
  //   : arr.join(" - ");
  try {
    return parseInt(price.toString()) < 0
      ? currency_symbol + " " + parseInt(price.toString()).toLocaleString(arg)
      : currency_symbol + " " + arr.join(" - ");
  } catch (err) {
    console.log("err" + err);
    return "";
  }
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

const censorWord = (str: string, to: number) => {
  return str.substring(0, to) + "x".repeat(str.length - to);
};

const censorEmail = (email: string) => {
  const arr = email.split("@");
  return (
    censorWord(arr[0], 2) +
    "@" +
    censorWord(arr[1]?.split(".")?.[0], 1) +
    "." +
    arr[1]?.split(".")?.[1]
  );
};

const censorPhoneNumber = (phoneNo: string) => {
  return "x".repeat(phoneNo?.length - 4) + phoneNo?.substr(phoneNo?.length - 4);
};

export {
  displayPriceWithCommas,
  displayPriceWithCommasFloat,
  makeid,
  censorEmail,
  censorPhoneNumber
};
