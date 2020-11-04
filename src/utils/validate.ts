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

export function removeFroala(timeout = 500) {
  setTimeout(() => {
    const pbf = document.querySelector('[data-f-id="pbf"]');
    if (pbf) {
      let style = pbf.getAttribute("style") || "";
      style = style.concat("display: none;");
      pbf.setAttribute("style", style);
    }
  }, timeout);
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
    console.log(e);
    console.log("Impression error");
  }
}

export function sliderProductImpression(
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
    product = data.map((prod: any, i: number) => {
      const index = prod.categories.length - 1;
      let category = prod.categories[index]
        ? prod.categories[index].replace(/\s/g, "")
        : "";
      category = category.replace(/>/g, "/");
      return Object.assign(
        {},
        {
          name: prod.title,
          id: prod.sku,
          category: category,
          list: list,
          // price: child.priceRecords[currency],
          brand: "Goodearth",
          position: position + i + 1,
          variant: prod.gaVariant
        }
      );
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
    console.log(e);
  }
}

export function promotionImpression(data: any) {
  try {
    const promotions = data.widgetImages.map((image: any) => {
      return {
        id: data.id || "",
        name: data.name,
        creative: image.title,
        position: image.order
      };
    });
    dataLayer.push({
      event: "promotionImpression",
      ecommerce: {
        promoView: {
          promotions: promotions
        }
      }
    });
  } catch (e) {
    console.log(e);
    console.log("promotionImpression error");
  }
}

export function PDP(data: any, currency: Currency) {
  try {
    const products = [];
    if (!data) return false;
    if (data.length < 1) return false;
    const index = data.categories.length - 1;
    let category = data.categories[index]
      ? data.categories[index].replace(/\s/g, "")
      : "";
    category = category.replace(/>/g, "/");
    products.push(
      data.childAttributes.map((child: any) => {
        return Object.assign(
          {},
          {
            name: data.title,
            id: child.sku,
            category: category,
            price: child.priceRecords[currency],
            brand: "Goodearth",
            variant: data.size
          }
        );
      })
    );
    dataLayer.push({
      event: "PDP",
      ecommerce: {
        detail: {
          products
        }
      }
    });
  } catch (e) {
    console.log(e);
    console.log("PDP impression error");
  }
}

export function collectionProductImpression(
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
    product = data.results.map((prod: any, i: number) => {
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
    console.log(e);
    console.log("Impression error");
  }
}

export function weRecommendProductImpression(
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
    product = data.map((prod: any, i: number) => {
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
    console.log(e);
    console.log("Impression error");
  }
}

export function plpProductClick(
  data: any,
  list: any,
  currency: Currency,
  position?: any
) {
  try {
    const products = [];
    position = position || 0;
    if (!data) return false;
    if (data.length < 1) return false;
    const index = data.categories.length - 1;
    let category = data.categories[index]
      ? data.categories[index].replace(/\s/g, "")
      : "";
    category = category.replace(/>/g, "/");
    products.push(
      data.childAttributes.map((child: any) => {
        return Object.assign(
          {},
          {
            name: data.title,
            id: child.sku,
            category: category,
            list: list,
            price: child.priceRecords[currency],
            brand: "Goodearth",
            position: position + 1,
            variant: data.color ? data.color[0] : data.gaVariant || ""
          }
        );
      })
    );
    dataLayer.push({
      event: "productClick",
      ecommerce: {
        currencyCode: currency,
        click: {
          actionField: { list: list },
          products: products
        }
      }
    });
  } catch (e) {
    console.log(e);
    console.log("ProductClick impression error");
  }
}

export function promotionClick(data: any) {
  try {
    const promotions = [
      {
        id: data.id || "",
        name: data.name,
        creative: data.title,
        position: data.order
      }
    ];
    dataLayer.push({
      event: "promotionClick",
      ecommerce: {
        promoClick: {
          promotions: promotions
        }
      }
    });
  } catch (e) {
    console.log(e);
    console.log("Promotion Click Impression error");
  }
}

export function MoreFromCollectionProductImpression(
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
    product = data.map((prod: any, i: number) => {
      return Object.assign(
        {},
        {
          name: prod.title,
          id: prod.sku || prod.id,
          category: "",
          list: list,
          price: prod.priceRecords[currency],
          brand: "Goodearth",
          position: position + i + 1,
          variant: ""
        }
      );
    });
    dataLayer.push({
      event: "productImpression",
      ecommerce: {
        currencyCode: currency,
        impressions: product
      }
    });
  } catch (e) {
    console.log(e);
    console.log("Impression error");
  }
}

export function MoreFromCollectionProductClick(
  data: any,
  list: any,
  currency: Currency,
  position: number
) {
  dataLayer.push({
    event: "productClick",
    ecommerce: {
      currencyCode: currency,
      click: {
        actionField: { list: list },
        products: [
          {
            name: data.title,
            id: data.sku || data.id,
            price: data.priceRecords[currency],
            brand: "Goodearth",
            category: "",
            variant: "",
            position: position
          }
        ]
      }
    }
  });
}
