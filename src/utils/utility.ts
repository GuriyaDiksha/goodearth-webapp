import { Currency } from "typings/currency";
import { currencyCodes } from "constants/currency";

function roundToNearest(price: string | number): string | number {
  if ((parseFloat(price.toString()) % 1).toFixed(3) < "0.750") {
    return Math.floor(price);
  } else {
    return Math.ceil(price);
  }
}

const displayPriceWithSeparation = (
  price: string | number,
  currency: Currency
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

  return `${currency_symbol} ${parseFloat(price.toString()).toLocaleString(
    arg,
    {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }
  )}`;
};

const displayPriceWithCommas = (
  price: string | number,
  currency: Currency,
  with_symbol: boolean | (() => boolean) = true,
  isRound = true
) => {
  let arg = "";
  if (currency == "INR") {
    arg = "en-IN";
  } else {
    arg = "en-US";
  }
  if (isRound) {
    if (price.toString().includes("-")) {
      price = `${String(
        roundToNearest(price.toString().split("-")[0])
      )}-${String(roundToNearest(price.toString().split("-")[1]))}`;
    } else {
      price = roundToNearest(price);
    }
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
    if (isRound) {
      arr.push(parseInt(price.toString()).toLocaleString(arg));
    } else {
      arr.push(parseFloat(price.toString()).toLocaleString(arg));
    }
  }
  return with_symbol
    ? currency_symbol + " " + arr.join(" - " + currency_symbol + " ")
    : arr.join(" - ");
};

const displayPriceWithCommasFloat = (
  price: string | number,
  currency: Currency,
  with_symbol: boolean | (() => boolean) = true,
  isRound = true
) => {
  let arg = "";
  if (currency == "INR") {
    arg = "en-IN";
  } else {
    arg = "en-US";
  }
  if (isRound) {
    if (price.toString().includes("-")) {
      price = `${String(
        roundToNearest(price.toString().split("-")[0])
      )}-${String(roundToNearest(price.toString().split("-")[1]))}`;
    } else {
      price = roundToNearest(price);
    }
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
    arr.push(
      parseFloat(price.toString()).toLocaleString(arg, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      })
    );
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

const censorWord = (str: string, to: number) => {
  return (
    str.substring(0, to) + "x".repeat(str.length > to ? str.length - to : 0)
  );
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
  // return "x".repeat(phoneNo?.length - 4) + phoneNo?.substr(phoneNo?.length - 4);
  return (
    phoneNo?.substring(0, 3) +
    "x".repeat(phoneNo?.length - 7) +
    phoneNo?.substr(phoneNo?.length - 4)
  );
};

export {
  displayPriceWithSeparation,
  displayPriceWithCommas,
  displayPriceWithCommasFloat,
  makeid,
  censorEmail,
  censorPhoneNumber
};
