import { Currency } from "typings/currency";

const displayPriceWithCommas = (price: string | number, currency: Currency) => {
  let arg = "";
  if (currency == "INR") {
    arg = "en-IN";
  } else {
    arg = "en-US";
  }
  if (price.toString().includes("-")) {
    const arr = price.toString().split("-");
    const temp: any[] = [];
    arr.map(e => {
      temp.push(parseInt(e.toString()).toLocaleString(arg));
    });
    return temp.join(" - ");
  }
  return parseInt(price.toString()).toLocaleString(arg);
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
  if (price.toString().includes("-")) {
    const arr = price.toString().split("-");
    const temp: any[] = [];
    arr.map(e => {
      temp.push(parseInt(e.toString()).toLocaleString(arg));
    });
    return temp.join(" - ");
  }
  return parseInt(price.toString()).toLocaleString(arg, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
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
