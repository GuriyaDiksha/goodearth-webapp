import { Currency } from "typings/currency";

const displayPriceWithCommas = (price: string | number, currency: Currency) => {
  let arg = "";
  if (currency == "INR") {
    arg = "en-IN";
  } else {
    arg = "en-US";
  }
  const arr: any[] = [];
  price
    .toString()
    .split("-")
    .map(e => {
      arr.push(parseInt(e.toString()).toLocaleString(arg));
    });
  return arr.join(" - ");
};

const displayPriceWithCommasFloat = (
  price: string | number,
  currency: Currency
) => {
  let arg = "";
  if (currency == "INR") {
    arg = "en-IN";
  } else {
    arg = "en-US";
  }
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
  return arr.join(" - ");
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
