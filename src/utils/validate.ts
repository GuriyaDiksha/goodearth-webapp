import { Currency } from "typings/currency";
import { Basket } from "typings/basket";

export function checkMail(email: any) {
  // original regex with escape characters "\["
  // /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const re = RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  return re.test(email.trim());
}

export function checkBlank(data: any) {
  return !data || data.toString().trim() == "" ? true : false;
}

export function checkPincode(data: any) {
  const re = /^[a-z\d\-_\s]+$/i;
  return re.test(data);
}

export function showErrors(errorMessage: any) {
  let msg = "";
  if (errorMessage) {
    if (typeof errorMessage == "object") {
      Object.keys(errorMessage).forEach(function(key) {
        msg = errorMessage[key];
      });
    } else {
      msg = errorMessage;
    }
  }
  return msg;
}

export function getIsdfromnumber(data: any) {
  "use strict";
  if (data.indexOf("+") > -1 && data.indexOf(" ") > -1) {
    return data.split(" ")[0];
  } else {
    return "";
  }
}

export function myPpup(e: Event) {
  "use strict";
  e.preventDefault();
  e.returnValue = false;
  // return "Hey, you're leaving the site. Bye!";
}

export function getPhnumber(data: any) {
  let num = [];
  if (data.indexOf("+") > -1 && data.indexOf(" ") > -1) {
    num = data.split(" ")[0];
    return data.split(num)[1].replace(/\s/g, "");
  } else {
    return data;
  }
}

export function isNumber(data: any) {
  const reg = new RegExp("^[0-9]{1,5}$");
  return reg.test(data);
}

export function copyTextToClipboard(text: string) {
  const textArea = document.createElement("textarea");
  // const style = {
  //     position: 'fixed',
  //     top: 0,
  //     left: 0,
  //     width: '2em',
  //     height: '2em',
  //     padding: 0,
  //     border: 'none',
  //     outline: 'none',
  //     boxShadow: 'none',
  //     background: 'transparent'
  // }
  // textArea.style = style;
  textArea.value = text;
  document.body.appendChild(textArea);
  const isIOSDevice = navigator.userAgent.match(/iphone|ipad/i);
  if (isIOSDevice) {
    textArea.setSelectionRange(0, text.length);
  }
  textArea.select();
  try {
    document.execCommand("copy");
  } catch (err) {
    console.log("Unable to copy!" + err);
  }
  document.body.removeChild(textArea);
  return false;
}

export function productForGa(data: Basket, currency: Currency) {
  let product: any = [];
  if (data.products) {
    product = data.products.map((prod: any) => {
      return Object.assign(
        {},
        {
          name: prod.product.title,
          id: prod.product.sku,
          list: "CHECKOUT",
          price: prod.product.pricerecords[currency],
          brand: "Goodearth",
          quantity: prod.quantity,
          variant: null
        }
      );
    });
  }

  return product;
}

export function productImpression(
  data: any,
  list: any,
  currency: Currency,
  position?: any
) {
  try {
    let product = [];
    position = position || 0;
    if (!data) return false;
    if (data.length < 1) return false;
    product = data.results.data.map((prod: any, i: number) => {
      const index = prod.categories.length - 1;
      let category = prod.categories[index]
        ? prod.categories[index].replace(/\s/g, "")
        : "";
      category = category.replace(/>/g, "/");
      return prod.childAttributes.map((child: any) => {
        return Object.assign(
          {},
          {
            name: prod.title,
            id: child.sku,
            category: category,
            list: list,
            price: child.priceRecords[currency],
            brand: "Goodearth",
            position: position + i + 1,
            variant: prod.color ? prod.color[0] : ""
          }
        );
      });
    });
    dataLayer.push({
      event: "productImpression",
      ecommerce: {
        currencyCode: currency,
        impressions: product
      }
    });
  } catch (e) {
    console.log("Impression error");
  }
}
