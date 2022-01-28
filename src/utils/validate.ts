import { Currency } from "typings/currency";
import { Basket } from "typings/basket";
import CookieService from "../services/cookie";
import { Dispatch } from "redux";
import { showMessage } from "actions/growlMessage";
import { DomUtils, parseDocument } from "htmlparser2";
import { useEffect, useState } from "react";

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

export function confirmPopup(e: Event) {
  "use strict";
  e.preventDefault();
  e.returnValue = false;
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

export const checkoutSteps = [
  "Initiated Checkout",
  "Shipping Details",
  "Billing Details",
  "Payment Details",
  "Proceed to Payment Gateway"
];

export function categoryForGa(categories: string[]) {
  let category = "";
  if (categories && categories.length > 0) {
    const index = categories.length - 1;
    category = categories[index] ? categories[index].replace(/\s/g, "") : "";
    category = category.replace(/>/g, "/");
  }
  return category;
}

export function productForBasketGa(data: Basket, currency: Currency) {
  let product: any = [];
  if (data.lineItems) {
    const quantitys: any = [];
    const skusid: any = [];
    const productname: any = [];
    const priceschild: any = [];
    const variantspdp: any = [];
    const collectionname: any = [];
    const categoryname: any = [];
    const subcategoryname: any = [];

    product = data.lineItems.map(prod => {
      const category = categoryForGa(prod.product.categories);
      const categorylist = category?.split("/");
      const realPrice = prod.product.childAttributes[0].discountedPriceRecords
        ? prod.product.childAttributes[0].discountedPriceRecords[currency]
        : prod.product.childAttributes[0].priceRecords[currency];
      quantitys.push(prod.quantity);
      skusid.push(prod.product.childAttributes[0].sku);
      productname.push(prod.product.title);
      variantspdp.push();
      collectionname.push(collectionname);
      priceschild.push(+realPrice);
      categoryname.push(categorylist[categorylist.length - 2]);
      subcategoryname.push(categorylist[categorylist.length - 1]);
      return Object.assign(
        {},
        {
          name: prod.product.title,
          id: prod.product.childAttributes[0].sku,
          price: realPrice,
          brand: "Goodearth",
          category: category,
          quantity: prod.quantity,
          variant: prod.product.childAttributes[0].size || ""
        }
      );
    });
    Moengage.track_event("Proceed to checkout", {
      "Product id": skusid,
      "Product name": productname,
      Quantity: quantitys,
      price: priceschild,
      Currency: currency,
      Size: variantspdp,
      // "Percentage discount",
      // "Collection name": data.collection,
      "Category name": categoryname,
      "Sub Category Name": subcategoryname
    });
  }

  return product;
}

export function removeFroala(timeout = 500) {
  setTimeout(() => {
    const pbf = document.querySelectorAll('[data-f-id="pbf"]');
    pbf.forEach(entry => {
      let style = entry.getAttribute("style") || "";
      style = style.concat("display: none;");
      entry.setAttribute("style", style);
    });
  }, timeout);
}

export function sanitizeContent(content: string) {
  if (content) {
    if (typeof document == "undefined") {
      const dom = parseDocument(content);
      const elems = DomUtils.getElements(
        { ["data-f-id"]: value => value == "pbf" },
        dom,
        true,
        1
      );
      if (elems.length > 0) {
        DomUtils.removeElement(elems[0]);
      }
      return DomUtils.getInnerHTML(dom);
    } else {
      const dom = new DOMParser().parseFromString(content, "text/html").body;
      const elem = dom.querySelector('p[data-f-id="pbf"]');
      if (elem) {
        elem.remove();
      }
      return dom.innerHTML;
    }
  }
  return content;
}

export function scrollToId() {
  setTimeout(() => {
    const { hash, search } = location;
    const id = search ? search.replace("?id=", "") : hash.replace("#", "");

    if (id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
        const headerHeight = 50;
        const secondaryHeaderHeight = 48;
        const announcementBarHeight = 30;
        window.scrollBy(
          0,
          -(headerHeight + secondaryHeaderHeight + announcementBarHeight)
        );
      }
    }
  }, 1000);
}

export function productImpression(
  data: any,
  list: any,
  currency: Currency,
  position?: any
) {
  try {
    const product: any = [];
    position = position || 0;
    if (!data) return false;
    if (data.length < 1) return false;
    const listPath = `${list}`;
    let categoryName = "";
    data.results.data.map((prod: any, i: number) => {
      let category = "";
      if (prod.categories) {
        const index = prod.categories.length - 1;
        category = prod.categories[index]
          ? prod.categories[index].replace(/\s/g, "")
          : "";
        categoryName = category.split(">")[0];
        category = category.replace(/>/g, "/");
      }
      let skus = "";
      let variants = "";
      let prices = "";
      prod.childAttributes.map((child: any) => {
        skus += "," + child.sku;
        variants += "," + child.size;
        prices +=
          "," +
          (child.discountedPriceRecords
            ? child.discountedPriceRecords[currency]
            : child.priceRecords[currency]);
      });
      skus = skus.slice(1);
      variants = variants.slice(1);
      prices = prices.slice(1);
      const childProduct = Object.assign(
        {},
        {
          name: prod.title,
          id: skus,
          category: category,
          list: listPath,
          price: prices,
          brand: "Goodearth",
          position: position + i + 1,
          variant: variants || ""
        }
      );
      product.push(childProduct);
    });
    dataLayer.push({ ecommerce: null });
    dataLayer.push({
      event: "productImpression",
      ecommerce: {
        currencyCode: currency,
        impressions: product
      }
    });
    Moengage.track_event("PLP views", {
      "Category Name": categoryName.trim()
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
    const product: any = [];
    position = position || 0;
    if (!data) return false;
    if (data.length < 1) return false;
    const listPath = `${list}`;
    data.map((prod: any, i: number) => {
      let category = "";
      if (prod.categories) {
        const index = prod.categories.length - 1;
        category = prod.categories[index]
          ? prod.categories[index].replace(/\s/g, "")
          : "";
        category = category.replace(/>/g, "/");
      }
      const childProduct = Object.assign(
        {},
        {
          name: prod.title,
          id: prod.sku,
          category: category,
          list: listPath,
          // price: child.priceRecords[currency],
          brand: "Goodearth",
          position: position + i + 1,
          variant: prod.size
        }
      );
      product.push(childProduct);
    });
    dataLayer.push({ ecommerce: null });
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

export function sliderProductClick(
  prod: any,
  list: any,
  currency: Currency,
  position?: any
) {
  try {
    let product = [];
    position = position || 0;
    if (!prod) return false;
    // if (data.length < 1) return false;
    const listPath = `${list}`;
    let category = "";
    if (prod.categories) {
      const index = prod.categories.length - 1;
      category = prod.categories[index]
        ? prod.categories[index].replace(/\s/g, "")
        : "";
      category = category.replace(/>/g, "/");
    }
    product = [
      Object.assign(
        {},
        {
          name: prod.title,
          id: prod.sku,
          category: category,
          // list: listPath,
          // price: child.priceRecords[currency],
          brand: "Goodearth",
          position: position + 1,
          variant: prod.size || ""
        }
      )
    ];
    dataLayer.push({
      event: "productClick",
      ecommerce: {
        currencyCode: currency,
        click: {
          actionField: { list: listPath },
          products: product
        }
      }
    });
    CookieService.setCookie("listPath", listPath);
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
    const products: any = [];
    if (!data) return false;
    if (data.length < 1) return false;
    let category = "";
    let categoryname = "";
    let subcategoryname = "";

    if (data.categories) {
      const index = data.categories.length - 1;
      category = data.categories[index]
        ? data.categories[index].replace(/\s/g, "")
        : "";
      const arr = category.split(">");
      categoryname = arr[arr.length - 2];
      subcategoryname = arr[arr.length - 1];
      category = category.replace(/>/g, "/");
    }
    let skus = "";
    let variants = "";
    let prices = "";

    const skusid: any = [];
    const variantspdp: any = [];
    const priceschild: any = [];
    const discountPrice: any = [];
    const quantitys: any = [];
    const colors: any = [];

    data.childAttributes.map((child: any) => {
      skusid.push(child.sku);
      variantspdp.push(child.size);
      priceschild.push(+child.priceRecords[currency]);
      discountPrice.push(+child.discountedPriceRecords[currency]);
      quantitys.push(child.stock);
      colors.push(child.color?.split("-")?.[1]);
      skus += "," + child.sku;
      variants += "," + child.size;
      prices +=
        "," +
        (child.discountedPriceRecords
          ? child.discountedPriceRecords[currency]
          : child.priceRecords
          ? child.priceRecords[currency]
          : data.priceRecords[currency]);
    });
    skus = skus.slice(1);
    variants = variants.slice(1);
    prices = prices.slice(1);
    const childProduct = Object.assign(
      {},
      {
        name: data.title,
        id: skus,
        category: category,
        price: prices,
        brand: "Goodearth",
        variant: variants || ""
      }
    );
    products.push(childProduct);

    Moengage.track_event("PDP View", {
      "Product id": skusid,
      "Product name": data.title,
      Quantity: quantitys,
      price: priceschild,
      Currency: currency,
      Color: colors,
      Size: variantspdp,
      "Original price": priceschild,
      "Discounted price": discountPrice,
      // "Percentage discount",
      "Collection name": data.collection,
      "Category name": categoryname,
      "Sub Category Name": subcategoryname
    });
    const listPath = CookieService.getCookie("listPath") || "DirectLandingView";
    dataLayer.push({ ecommerce: null });
    dataLayer.push({
      event: "productDetailImpression",
      ecommerce: {
        detail: {
          actionField: { list: listPath },
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
    const product: any = [];
    position = position || 0;
    if (!data) return false;
    if (data.length < 1) return false;
    const listPath = `${list}`;

    data.results.map((prod: any, i: number) => {
      let category = "";
      if (prod.categories) {
        const index = prod.categories.length - 1;
        category = prod.categories[index]
          ? prod.categories[index].replace(/\s/g, "")
          : "";
        category = category.replace(/>/g, "/");
      }
      let skus = "";
      let variants = "";
      let prices = "";
      prod.childAttributes.map((child: any) => {
        skus += "," + child.sku;
        variants += "," + child.size;
        prices +=
          "," +
          (child.discountedPriceRecords
            ? child.discountedPriceRecords[currency]
            : child.priceRecords[currency]);
      });
      skus = skus.slice(1);
      variants = variants.slice(1);
      prices = prices.slice(1);
      const childProduct = Object.assign(
        {},
        {
          name: prod.title,
          id: skus,
          category: category,
          list: listPath,
          price: prices,
          brand: "Goodearth",
          position: position + i + 1,
          variant: variants || ""
        }
      );
      product.push(childProduct);
    });
    dataLayer.push({ ecommerce: null });
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
    const product: any = [];
    position = position || 0;
    if (!data) return false;
    if (data.length < 1) return false;
    const listPath = `${list}`;
    data.map((prod: any, i: number) => {
      let category = "";
      if (prod.categories) {
        const index = prod.categories.length - 1;
        category = prod.categories[index]
          ? prod.categories[index].replace(/\s/g, "")
          : "";
        category = category.replace(/>/g, "/");
      }
      let skus = "";
      let variants = "";
      let prices = "";
      prod.childAttributes.map((child: any) => {
        skus += "," + child.sku;
        variants += "," + child.size;
        prices +=
          "," +
          (child.discountedPriceRecords
            ? child.discountedPriceRecords[currency]
            : child.priceRecords[currency]);
      });
      skus = skus.slice(1);
      variants = variants.slice(1);
      prices = prices.slice(1);
      const childProduct = Object.assign(
        {},
        {
          name: prod.title,
          id: skus,
          category: category,
          list: listPath,
          price: prices,
          brand: "Goodearth",
          position: position + i + 1,
          variant: variants || ""
        }
      );
      product.push(childProduct);
    });
    dataLayer.push({ ecommerce: null });
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
    let category = "";
    if (data.categories) {
      const index = data.categories.length - 1;
      category = data.categories[index]
        ? data.categories[index].replace(/\s/g, "")
        : "";
      category = category.replace(/>/g, "/");
    }
    products.push(
      data.childAttributes.map((child: any) => {
        return Object.assign(
          {},
          {
            name: data.title,
            id: child.sku,
            category: category,
            // list: list,
            price: child.discountedPriceRecords
              ? child.discountedPriceRecords[currency]
              : child.priceRecords[currency],
            brand: "Goodearth",
            position: position + 1,
            variant: child.size || ""
          }
        );
      })
    );
    const listPath = `${list}`;
    CookieService.setCookie("listPath", listPath);
    dataLayer.push({
      event: "productClick",
      ecommerce: {
        currencyCode: currency,
        click: {
          actionField: { list: listPath },
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
    const product: any = [];
    position = position || 0;
    if (!data) return false;
    if (data.length < 1) return false;
    const listPath = `${list}`;
    data.map((prod: any, i: number) => {
      let category = "";
      if (prod.categories) {
        const index = prod.categories.length - 1;
        category = prod.categories[index]
          ? prod.categories[index].replace(/\s/g, "")
          : "";
        category = category.replace(/>/g, "/");
      }
      let skus = "";
      let variants = "";
      let prices = "";
      prod.childAttributes.map((child: any) => {
        skus += "," + child.sku;
        variants += "," + child.size;
        prices +=
          "," +
          (child.discountedPriceRecords
            ? child.discountedPriceRecords[currency]
            : child.priceRecords[currency]);
      });
      skus = skus.slice(1);
      variants = variants.slice(1);
      prices = prices.slice(1);
      const childProduct = Object.assign(
        {},
        {
          name: prod.title,
          id: skus,
          category: category,
          list: listPath,
          price: prices,
          brand: "Goodearth",
          position: position + i + 1,
          variant: variants || ""
        }
      );
      product.push(childProduct);
    });
    dataLayer.push({ ecommerce: null });
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
  const products = [];
  if (!data) return false;
  if (data.length < 1) return false;
  let category = "";
  if (data.categories) {
    const index = data.categories.length - 1;
    category = data.categories[index]
      ? data.categories[index].replace(/\s/g, "")
      : "";
    category = category.replace(/>/g, "/");
  }
  products.push(
    data.childAttributes.map((child: any) => {
      return Object.assign(
        {},
        {
          name: data.title,
          id: child.sku,
          price: child.discountedPriceRecords
            ? child.discountedPriceRecords[currency]
            : child.priceRecords[currency],
          brand: "Goodearth",
          category: category,
          variant: child.size || "",
          position: position
        }
      );
    })
  );
  const listPath = `${list}`;
  CookieService.setCookie("listPath", listPath);
  dataLayer.push({
    event: "productClick",
    ecommerce: {
      currencyCode: currency,
      click: {
        actionField: { list: listPath },
        products: products
      }
    }
  });
}

export function errorTracking(errorMessage: string[], url: string) {
  try {
    dataLayer.push({
      event: "errorMessage",
      "Error Message": errorMessage,
      "Error URL": url
    });
  } catch (e) {
    console.log(e);
    console.log("error Tracking error");
  }
}

const toArray = (x: HTMLCollectionOf<Element>): any[] => {
  const arr = [];
  for (let i = 0; i < x.length; i++) {
    arr.push(x[i]);
  }
  return arr;
};

export function getErrorList(
  errorClass: string,
  containerId?: string
): string[] {
  if (containerId) {
    return toArray(
      document
        .getElementById(containerId)
        ?.getElementsByClassName(errorClass) as HTMLCollectionOf<Element>
    )
      .map((element: HTMLElement) => element.textContent)
      .filter(error => error) as string[];
  } else {
    return toArray(
      document.getElementsByClassName(errorClass) as HTMLCollectionOf<Element>
    )
      .map((element: HTMLElement) => element.textContent)
      .filter(error => error) as string[];
  }
}

const getUniqueId = () => {
  return Math.floor((1 + Math.random()) * 0x1000)
    .toString(16)
    .substring(1);
};
export const showGrowlMessage = (
  dispatch: Dispatch,
  text: string,
  timeout = 3000,
  id?: string,
  params?: any
) => {
  const newId = id ? id : getUniqueId();
  dispatch(showMessage(text, timeout, newId, params));
};

export const checkoutGTM = (
  step: number,
  currency: Currency,
  basket: Basket
) => {
  const productList = productForBasketGa(basket, currency);
  dataLayer.push({
    event: "checkout",
    ecommerce: {
      currencyCode: currency,
      checkout: {
        actionField: { step, option: checkoutSteps[step - 1] },
        products: productList
      }
    }
  });
};

export const headerClickGTM = (
  clickType: string,
  location: "Top" | "Bottom",
  mobile: boolean,
  isLoggedIn: boolean
) => {
  try {
    dataLayer.push({
      event: "Header Click",
      clickType,
      location,
      device: mobile ? "mobile" : "desktop",
      userStatus: isLoggedIn ? "logged in" : "logged out"
    });
  } catch (e) {
    console.log("Header click GTM error!");
  }
};

export const getInnerText = (input: string) => {
  if (input) {
    if (typeof document == "undefined") {
      const elem2 = parseDocument(input).children;
      return DomUtils.innerText(elem2);
    }
    const elem = new DOMParser().parseFromString(input, "text/html").body;
    return elem.innerText;
  }
  return input;
};

export const menuNavigationGTM = ({
  l1,
  l2,
  l3,
  clickUrl1,
  clickUrl2,
  clickUrl3,
  mobile,
  isLoggedIn
}: {
  [x: string]: string | boolean;
  mobile: boolean;
  isLoggedIn: boolean;
}) => {
  try {
    dataLayer.push({
      event: "Menu Navigation",
      clickType: "Category",
      l1,
      l2,
      l3,
      clickUrl1,
      clickUrl2,
      clickUrl3,
      device: mobile ? "mobile" : "desktop",
      userStatus: isLoggedIn ? "logged in" : "logged out",
      url: `${location.pathname}${location.search}`
    });
  } catch (e) {
    console.log("Menu Navigation GTM error!");
  }
};

export const megaMenuNavigationGTM = ({
  l1,
  l2,
  l3,
  clickUrl1,
  clickUrl2,
  clickUrl3,
  template,
  img2,
  img3,
  cta,
  subHeading,
  mobile,
  isLoggedIn
}: {
  [x: string]: string | boolean;
  mobile: boolean;
  isLoggedIn: boolean;
}) => {
  try {
    if (l3) {
      Moengage.track_event("L1Clicked", {
        "Category Name": l3
      });
    } else if (l2) {
      Moengage.track_event("L2Clicked", {
        "Category Name": l2
      });
    } else if (l1 && !template) {
      Moengage.track_event("L1Clicked", {
        "Category Name": l1
      });
    }

    if (template) {
      let eventName = "";
      switch (template) {
        case "CONTENT":
          eventName = "Content template";
          break;
        case "TITLEHEADING":
          eventName = "Title Heading template";
          break;
        case "L2L3":
          eventName = "L2L3 Template";
          break;
        case "IMAGE":
          eventName = "Image Template";
          break;
        case "VERTICALIMAGE":
          eventName = "Vertical image Template";
          break;
        default:
          eventName = "";
      }
      Moengage.track_event(eventName, {
        "Category Name": l1
      });
    }

    dataLayer.push({
      event: "Menu Navigation",
      clickType: "Category",
      l1,
      l2,
      l3,
      clickUrl1,
      clickUrl2,
      clickUrl3,
      template,
      img2,
      img3,
      cta,
      subHeading,
      device: mobile ? "mobile" : "desktop",
      userStatus: isLoggedIn ? "logged in" : "logged out",
      url: `${location.pathname}${location.search}`
    });
  } catch (e) {
    console.log("Menu Navigation GTM error!");
  }
};

export const pageViewGTM = (title: string) => {
  try {
    dataLayer.push({
      event: "pageview",
      page: {
        path: location.pathname,
        title
      }
    });
  } catch (e) {
    console.log("Page VIew GTM error!");
  }
};

export const moveChatUp = () => {
  const chatContainer = document.getElementById("chat-container");
  if (chatContainer) {
    chatContainer.classList.remove("chat-container-down");
    chatContainer.classList.add("chat-container");
  }
};

export const moveChatDown = () => {
  const chatContainer = document.getElementById("chat-container");
  if (chatContainer) {
    chatContainer.classList.remove("chat-container");
    chatContainer.classList.add("chat-container-down");
  }
};

export const viewSelectionGTM = (clickType: "list" | "grid") => {
  try {
    dataLayer.push({
      event: "View Selection",
      clickType
    });
  } catch (e) {
    console.log("View Selection GTM error!");
  }
};

export const sortGTM = (clickType: string) => {
  try {
    dataLayer.push({
      event: "Sort",
      clickType,
      url: `${location.pathname}${location.search}`
    });
  } catch (e) {
    console.log("Sort GTM error!");
  }
};

export const footerGTM = (clickType: string) => {
  try {
    dataLayer.push({
      event: "Footer Navigation",
      clickType,
      url: `${location.pathname}${location.search}`
    });
  } catch (e) {
    console.log("Footer Navigation GTM error!");
  }
};

export const announcementBarGTM = (clickText: string, clickUrl: string) => {
  try {
    dataLayer.push({
      event: "Announcement Bar Click",
      clickText,
      clickUrl,
      url: `${location.pathname}${location.search}`
    });
  } catch (e) {
    console.log("Announcement Bar click GTM error!");
  }
};

export function useOnScreen(ref: any) {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = new IntersectionObserver(([entry]) =>
    setIntersecting(entry.isIntersecting)
  );

  useEffect(() => {
    observer.observe(ref.current);
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, []);

  return isIntersecting;
}
