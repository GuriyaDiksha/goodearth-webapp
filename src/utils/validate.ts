import { Currency } from "typings/currency";
import { Basket } from "typings/basket";
import CookieService from "../services/cookie";
import { Dispatch } from "redux";
import { showMessage } from "actions/growlMessage";
import { DomUtils, parseDocument } from "htmlparser2";
import { useEffect, useState } from "react";
import { GA_CALLS } from "constants/cookieConsent";
import { sha256 } from "js-sha256";
import CryptoJS from "crypto-js";
import { isObject } from "lodash";
// import { AppState } from "reducers/typings";
// import { useSelector } from "react-redux";

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
  "Payment confirmation",
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
    product = data.lineItems.map(prod => {
      const category = categoryForGa(prod.product.categories);
      const realPrice = prod.GCValue;
      return Object.assign(
        {},
        {
          name: prod.product.title,
          id: prod.product.childAttributes[0].sku,
          price: realPrice,
          brand: "Goodearth",
          category: category,
          quantity: prod.quantity,
          variant: prod.product.childAttributes[0].size || "",
          dimension12: prod.product.childAttributes[0]?.color
        }
      );
    });
  }

  return product;
}

export function dataForBilling(data: Basket, currency: Currency) {
  let product: any = [];
  if (data.lineItems) {
    // let categoryName = "";
    // let subcategory = "";
    let collectionName = "";
    // const search = CookieService.getCookie("search") || "";
    product = data.lineItems.map((prod, ind) => {
      const realPrice = prod.GCValue;
      let category = "";
      const { product } = prod;
      if (product.categories) {
        const index = product.categories.length - 1;
        category = product.categories[index]
          ? product.categories[index].replace(/\s/g, "")
          : "";
        // categoryName = category.split(">")[0];
        // subcategory = category.split(">")[1];
        if (
          !collectionName &&
          product.collections &&
          product.collections.length > 0
        ) {
          collectionName = product.collections[0];
        }
        category = category.replace(/>/g, "/");
      }

      const search = CookieService.getCookie("search") || "";
      const cat1 = product?.categories?.[0]?.split(">");
      const cat2 = product?.categories?.[1]?.split(">");

      const L1 = cat1?.[0]?.trim();

      const L2 = cat1?.[1] ? cat1?.[1]?.trim() : cat2?.[1]?.trim();

      const L3 = cat2?.[2]
        ? cat2?.[2]?.trim()
        : product?.categories?.[2]?.split(">")?.[2]?.trim();

      const clickType = localStorage.getItem("clickType");
      return Object.assign(
        {},
        {
          item_id: prod.product.childAttributes[0].sku, //Pass the product id
          item_name: prod.product.title, // Pass the product name
          affiliation: prod.product.title, // Pass the product name
          coupon: "NA", // Pass the coupon if available
          currency: currency, // Pass the currency code
          discount: product.discountedPriceRecords
            ? product?.badgeType == "B_flat"
              ? product.discountedPriceRecords[currency]
              : realPrice - product.discountedPriceRecords[currency]
            : "NA", // Pass the discount amount
          index: ind,
          item_brand: "Goodearth",
          item_category: L1,
          item_category2: L2,
          item_category3: L3,
          item_category4: "NA",
          item_category5: prod.product.is3d ? "3d" : "non3d",
          item_list_id: "NA",
          item_list_name: search ? `${clickType}-${search}` : "NA",
          item_variant: prod.product?.childAttributes[0]?.size || "NA",
          // item_category5: collectionName,
          price: realPrice,
          quantity: prod.quantity,
          collection_category: product?.collections?.join("|"),
          price_range: "NA"
        }
      );
    });
  }

  return product;
}

export function productForGa(data: Basket) {
  let product: any = [];
  if (data.lineItems) {
    product = data.lineItems.map(prod => {
      return Object.assign(
        {},
        {
          id: prod.product.childAttributes[0].sku,
          quantity: prod.quantity
        }
      );
    });
  }

  return product;
}

export function proceedTocheckout(
  data: Basket,
  currency: Currency,
  isSale?: boolean
) {
  if (data.lineItems) {
    const quantitys: any = [];
    const skusid: any = [];
    const productname: any = [];
    const priceschild: any = [];
    const variantspdp: any = [];
    const collectionname: any = [];
    const categoryname: any = [];
    const subcategoryname: any = [];
    const userConsent = CookieService.getCookie("consent").split(",");
    const search = CookieService.getCookie("search") || "";
    data.lineItems.map(prod => {
      const category = categoryForGa(prod.product.categories);
      const categorylist = category?.split("/");
      const realPrice = prod.product.childAttributes[0].discountedPriceRecords
        ? prod.product.childAttributes[0].discountedPriceRecords[currency]
        : prod.product.childAttributes[0].priceRecords[currency];
      quantitys.push(prod.quantity);
      skusid.push(prod.product.childAttributes[0].sku);
      productname.push(prod.product.title);
      variantspdp.push(prod.product.childAttributes[0].size);
      collectionname.push(prod.product.collection);
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
    // let categoryName = "";
    // let subcategory = "";
    let collectionName = "";
    const childAttr = data.lineItems.map((child: any, index: number) => {
      let category = "";
      const { product } = child;
      const realPrice = child.GCValue;
      if (product.categories) {
        const index = product.categories.length - 1;
        category = product.categories[index]
          ? product.categories[index].replace(/\s/g, "")
          : "";
        // categoryName = category.split(">")[0];
        // subcategory = category.split(">")[1];
        if (
          !collectionName &&
          product.collections &&
          product.collections.length > 0
        ) {
          collectionName = product.collections[0];
        }
        category = category.replace(/>/g, "/");
      }
      let skus = "";
      let variants = "";
      let prices = "";

      const cat1 = product.categories?.[0]?.split(">");
      const cat2 = product.categories?.[1]?.split(">");

      const L1 = cat1?.[0]?.trim();

      const L2 = cat1?.[1] ? cat1?.[1]?.trim() : cat2?.[1]?.trim();

      const L3 = cat2?.[2]
        ? cat2?.[2]?.trim()
        : product.categories?.[2]?.split(">")?.[2]?.trim();

      const clickType = localStorage.getItem("clickType");

      product.childAttributes.map((child: any) => {
        skus += "," + child.sku;
        variants += "," + child.size;
        prices += "," + child.GCValue;
      });
      skus = skus.slice(1);
      variants = variants.slice(1);
      prices = prices.slice(1);
      return Object.assign(
        {},
        {
          item_id: skus, //Pass the product id
          item_name: product.title,
          affiliation: "NA",
          coupon: "NA", // Pass the coupon if available
          currency: currency, // Pass the currency code
          discount:
            isSale && product.discountedPriceRecords
              ? product.childAttributes?.[0]?.badgeType == "B_flat"
              : product?.discountedPriceRecords[currency]
              ? product?.priceRecords[currency] -
                product.childAttributes[0]?.discountedPriceRecords[currency]
              : "NA", // Pass the discount amount
          index: index,
          item_brand: "goodearth",
          item_category: L1,
          item_category2: L2,
          item_category3: L3,
          item_category4: "NA",
          item_category5: product.is3d ? "3d" : "non3d",
          item_list_id: "NA",
          item_list_name: search ? `${clickType}-${search}` : "NA",
          item_variant: product?.childAttributes[0]?.size || "NA",
          price: realPrice,
          quantity: 1,
          collection_category: product?.collections?.join("|"),
          price_range: "NA"
        }
      );
    });
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      dataLayer.push({
        event: "begin_checkout",
        previous_page_url: CookieService.getCookie("prevUrl"),
        ecommerce: {
          currency: currency,
          value: data.subTotalWithShipping,
          coupon: "NA", //Pass NA if Not applicable at the moment
          items: childAttr
        }
      });
    }
    if (userConsent.includes(GA_CALLS)) {
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
  }
}

export function proceedForPayment(
  data: Basket,
  currency: Currency,
  paymentMethod: string,
  isSale?: boolean
) {
  if (data.lineItems) {
    const userConsent = CookieService.getCookie("consent").split(",");
    // let categoryName = "";
    let collectionName = "";
    // const search = CookieService.getCookie("search") || "";
    const childAttr = data.lineItems.map((child: any, index: number) => {
      let category = "";
      const { product } = child;
      const search = CookieService.getCookie("search") || "";
      const clickType = localStorage.getItem("clickType");

      if (product.categories) {
        const index = product.categories.length - 1;
        category = product.categories[index]
          ? product.categories[index].replace(/\s/g, "")
          : "";
        // categoryName = category.split(">")[0];
        if (
          !collectionName &&
          product.collections &&
          product.collections.length > 0
        ) {
          collectionName = product.collections[0];
        }
        category = category.replace(/>/g, "/");
      }
      let skus = "";
      let variants = "";
      let prices = "";

      const cat1 = product?.categories?.[0]?.split(">");
      const cat2 = product?.categories?.[1]?.split(">");

      const L1 = cat1?.[0]?.trim();

      const L2 = cat1?.[1] ? cat1?.[1]?.trim() : cat2?.[1]?.trim();

      const L3 = cat2?.[2]
        ? cat2?.[2]?.trim()
        : product?.categories?.[2]?.split(">")?.[2]?.trim();

      product.childAttributes.map((child: any) => {
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
      return Object.assign(
        {},
        {
          item_id: skus, //Pass the product id
          item_name: product.title,
          affiliation: "NA",
          coupon: "NA", // Pass the coupon if available
          currency: currency, // Pass the currency code
          discount:
            isSale && product.discountedPriceRecords
              ? product?.badgeType == "B_flat"
                ? product.discountedPriceRecords[currency]
                : product.priceRecords[currency] -
                  product.discountedPriceRecords[currency]
              : "NA", // Pass the discount amount
          index: index,
          item_brand: "goodearth",
          item_category: L1,
          item_category2: L2,
          item_category3: L3,
          item_category4: "NA",
          item_category5: product.is3d ? "3d" : "non3d",
          item_list_id: "NA",
          item_list_name: search ? `${clickType}-${search}` : "NA",
          item_variant: product?.childAttributes[0]?.size || "NA",
          // item_category5: collectionName,
          price: product.priceRecords[currency],
          quantity: 1,
          collection_category: product?.collections?.join("|"),
          price_range: "NA"
        }
      );
    });
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      dataLayer.push({
        event: "add_payment_info",
        previous_page_url: CookieService.getCookie("prevUrl"),
        ecommerce: {
          currency: currency, // Pass the currency code
          value: data.total,
          coupon: "NA", // Pass the coupon if available
          payment_type: paymentMethod,
          items: childAttr
        }
      });
    }
  }
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

export function scrollToGivenId(id: string) {
  setTimeout(() => {
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
  }, 500);
}

export function productImpression(
  data: any,
  list: any,
  currency: Currency,
  position?: any,
  isSale?: boolean,
  priceRange?: string
) {
  try {
    const product: any = [];
    position = position || 0;
    if (!data) return false;
    if (data.length < 1) return false;
    const listPath = `${list}`;
    let categoryName = "";
    let subcategoryname = "";
    let collectionName = "";
    const search = CookieService.getCookie("search") || "";
    const clickType = localStorage.getItem("clickType");
    data?.results?.data.map((prod: any, i: number) => {
      let category = "";
      if (prod.categories) {
        const index = prod.categories.length - 1;
        category = prod.categories[index]
          ? prod.categories[index].replace(/\s/g, "")
          : "";
        categoryName = category.split(">")[0];
        subcategoryname = category.split(">")[1];
        if (
          !collectionName &&
          prod.collections &&
          prod.collections.length > 0
        ) {
          collectionName = prod.collections[0];
        }
        category = category.replace(/>/g, "/");
      }
      // let skus = "";
      // let variants = "";
      // let prices = "";

      prod.childAttributes.map((child: any) => {
        // skus += "," + child.sku;
        // variants += "," + child.size;
        // prices +=
        //   "," +
        //   (child.discountedPriceRecords
        //     ? child.discountedPriceRecords[currency]
        //     : child.priceRecords[currency]);

        const childProduct = Object.assign(
          {},
          {
            name: prod.title,
            id: child.sku,
            category: category,
            list: listPath,
            price: child.discountedPriceRecords
              ? child.discountedPriceRecords[currency]
              : child.priceRecords[currency],
            brand: "Goodearth",
            position: position + i + 1,
            variant: child.size || "",
            dimension12: child?.color
          }
        );
        product.push(childProduct);
      });
      // skus = skus.slice(1);
      // variants = variants.slice(1);
      // prices = prices.slice(1);
      // const childProduct = Object.assign(
      //   {},
      //   {
      //     name: prod.title,
      //     id: skus,
      //     category: category,
      //     list: listPath,
      //     price: prices,
      //     brand: "Goodearth",
      //     position: position + i + 1,
      //     variant: variants || ""
      //   }
      // );
      // product.push(childProduct);
    });

    const childAttr: any[] = [];
    let L1: string, L2: string, L3: string, cat1, cat2;
    data?.results?.data.map((child: any, index: number) => {
      let category = "";

      if (child.categories) {
        const index = child.categories.length - 1;
        category = child.categories[index]
          ? child.categories[index].replace(/\s/g, "")
          : "";
        categoryName = category.split(">")[0];
        subcategoryname = category.split(">")[1];
        if (
          !collectionName &&
          child.collections &&
          child.collections.length > 0
        ) {
          collectionName = child.collections?.join("|");
        }
        category = child.categories[2]
          ? child.categories[2]?.replace(/\s/g, "")
          : (category || "").replace(/>/g, "/");

        cat1 = child.categories?.[0]?.split(">");
        cat2 = child.categories?.[1]?.split(">");

        L1 = cat1?.[0]?.trim();

        L2 = cat1?.[1] ? cat1?.[1]?.trim() : cat2?.[1]?.trim();

        L3 = cat2?.[2]
          ? cat2?.[2]?.trim()
          : child.categories?.[2]?.split(">")?.[2]?.trim();
      }

      const sizes = child.childAttributes
        ?.map((ele: any) => ele.size)
        ?.join("|");

      childAttr.push(
        Object.assign(
          {},
          {
            item_id: child.id, //Pass the product id
            item_name: child.title,
            affiliation: "NA",
            coupon: "NA", // Pass the coupon if available
            currency: currency, // Pass the currency code
            discount:
              isSale && child.discountedPriceRecords
                ? child?.badgeType == "B_flat"
                  ? child.discountedPriceRecords[currency]
                  : child.priceRecords[currency] -
                    child.discountedPriceRecords[currency]
                : "NA", // Pass the discount amount
            index: index,
            item_brand: "goodearth",
            item_category: L1,
            item_category2: L2,
            item_category3: L3,
            item_category4: "NA",
            item_category5: "NA",
            item_list_id: "NA",
            item_list_name: search ? `${clickType}-${search}` : "NA",
            item_variant: sizes,
            collection_category: child?.collections?.join("|"),
            price: child.discountedPriceRecords
              ? child.discountedPriceRecords[currency]
              : child.priceRecords[currency],
            quantity: 1,
            price_range: priceRange || "NA"
          }
        )
      );
    });
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({ ecommerce: null });
      dataLayer.push({
        event: "productImpression",
        ecommerce: {
          currencyCode: currency,
          impressions: product
        }
      });
      dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      dataLayer.push({
        event: "view_item_list",
        previous_page_url: CookieService.getCookie("prevUrl"),
        ecommerce: {
          items: [childAttr]
        }
      });
    }
    if (userConsent.includes(GA_CALLS)) {
      Moengage.track_event("PLP views", {
        "Category Name": categoryName.trim(),
        "Sub Category Name": subcategoryname.trim(),
        "Collection Name": collectionName
      });
    }
  } catch (e) {
    // console.log(e);
    console.log("Impression error", e);
  }
}

export const gaEventsForSearch = (
  data: any,
  clickType?: string,
  ctaName?: string,
  serachVal?: string
) => {
  const userConsent = CookieService.getCookie("consent").split(",");
  const recentSearch = localStorage.getItem("recentSearchValue");
  const popularSearch = localStorage.getItem("popularSearch");
  const inputValue = localStorage.getItem("inputValue");
  const searchTerm = recentSearch || popularSearch || inputValue || serachVal;

  if (
    userConsent.includes(GA_CALLS) &&
    (popularSearch || recentSearch || inputValue || clickType)
  ) {
    if (
      data?.results?.data?.length ||
      (clickType && data?.length) ||
      clickType === "Products"
    ) {
      dataLayer.push({
        event: "search_bar_results_found",
        click_type: recentSearch
          ? "Recent search"
          : popularSearch
          ? "Popular search"
          : clickType
          ? clickType
          : "Input",
        cta_name:
          ctaName || recentSearch || popularSearch || "View all results",
        search_term: searchTerm?.toLocaleLowerCase()
      });
    } else {
      dataLayer.push({
        event: "search_bar_no_results_found",
        click_type: recentSearch
          ? "Recent search"
          : popularSearch
          ? "Popular search"
          : clickType
          ? clickType
          : "Input",
        cta_name:
          ctaName || recentSearch || popularSearch || "View all results",
        search_term: searchTerm?.toLocaleLowerCase()
      });
    }
    localStorage.removeItem("recentSearchValue");
    localStorage.removeItem("popularSearch");
    localStorage.removeItem("inputValue");
    localStorage.removeItem("viewAllResults");
  }
};

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
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({ ecommerce: null });
      dataLayer.push({
        event: "productImpression",
        ecommerce: {
          currencyCode: currency,
          impressions: product
        }
      });
    }
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
          variant: prod.size || "",
          dimension12: prod?.color
        }
      )
    ];
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
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
    }
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
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "promotionImpression",
        ecommerce: {
          promoView: {
            promotions: promotions
          }
        }
      });
    }
  } catch (e) {
    console.log(e);
    console.log("promotionImpression error");
  }
}

export function PDP(data: any, currency: Currency, isSale?: boolean) {
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

    const cat1 = data.categories?.[0]?.split(">");
    const cat2 = data.categories?.[1]?.split(">");

    const L1 = cat1?.[0]?.trim();

    const L2 = cat1?.[1] ? cat1?.[1]?.trim() : cat2?.[1]?.trim();

    const L3 = cat2?.[2]
      ? cat2?.[2]?.trim()
      : data.categories?.[2]?.split(">")?.[2]?.trim();

    const clickType = localStorage.getItem("clickType");
    const skusid: any = [];
    const variantspdp: any = [];
    const priceschild: any = [];
    const discountPrice: any = [];
    const quantitys: any = [];
    const colors: any = [];
    const userConsent = CookieService.getCookie("consent").split(",");
    const search = CookieService.getCookie("search") || "";
    const sizes = data.childAttributes?.map((ele: any) => ele.size)?.join("|");

    const childAttr =
      // data?.childAttributes.map((child: any, index: number) => {
      Object.assign(
        {},
        {
          item_id: data.id, //Pass the product id
          item_name: data.title,
          affiliation: "NA",
          coupon: "NA", // Pass the coupon if available
          currency: currency, // Pass the currency code
          discount:
            isSale && data.discountedPriceRecords
              ? data?.badgeType == "B_flat"
                ? data.discountedPriceRecords[currency]
                : data.priceRecords[currency] -
                  data.discountedPriceRecords[currency]
              : "NA", // Pass the discount amount
          index: "NA",
          item_brand: "goodearth",
          collection_category: data.collections?.join("|"),
          price: data.priceRecords[currency],
          quantity: 1,
          item_category: L1,
          item_category2: L2,
          item_category3: L3,
          item_category4: "NA",
          item_category5: "NA",
          item_list_id: "NA",
          item_list_name: search ? `${clickType}-${search}` : "NA",
          item_variant: sizes,
          price_range: "NA"
        }
      );
    // });
    data.childAttributes?.map((child: any) => {
      skusid.push(child.sku);
      variantspdp.push(child.size);
      priceschild.push(+child.priceRecords[currency]);
      discountPrice.push(+child.discountedPriceRecords[currency]);
      quantitys.push(child.stock);
      colors.push(child.color?.split("-")?.[1]);
      // skus += "," + child.sku;
      // variants += "," + child.size;
      // prices +=
      //   "," +
      //   (child.discountedPriceRecords
      //     ? child.discountedPriceRecords[currency]
      //     : child.priceRecords
      //     ? child.priceRecords[currency]
      //     : data.priceRecords[currency]);

      const childProduct = Object.assign(
        {},
        {
          name: data.title,
          id: child.sku,
          category: category,
          price: child.discountedPriceRecords
            ? child.discountedPriceRecords[currency]
            : child.priceRecords
            ? child.priceRecords[currency]
            : data.priceRecords[currency],
          brand: "Goodearth",
          variant: child.size || "",
          dimension8: data.sliderImages?.some((key: any) => key.icon)
            ? "View3d"
            : "nonView3d"
        }
      );
      products.push(childProduct);
    });
    // skus = skus.slice(1);
    // variants = variants.slice(1);
    // prices = prices.slice(1);

    if (userConsent.includes(GA_CALLS)) {
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
    }
    const listPath = CookieService.getCookie("listPath") || "DirectLandingView";
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      dataLayer.push({
        event: "view_item",
        previous_page_url: CookieService.getCookie("prevUrl"),
        ecommerce: {
          items: [childAttr]
        }
      });
      dataLayer.push({ ecommerce: null });
      dataLayer.push({
        event: "productDetailImpression",
        ecommerce: {
          currencyCode: currency,
          detail: {
            actionField: { list: listPath },
            products
          }
        }
      });
    }
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
      // let skus = "";
      // let variants = "";
      // let prices = "";
      prod.childAttributes.map((child: any) => {
        // skus += "," + child.sku;
        // variants += "," + child.size;
        // prices +=
        //   "," +
        //   (child.discountedPriceRecords
        //     ? child.discountedPriceRecords[currency]
        //     : child.priceRecords[currency]);

        const childProduct = Object.assign(
          {},
          {
            name: prod.title,
            id: child.sku,
            category: category,
            list: listPath,
            price: child.discountedPriceRecords
              ? child.discountedPriceRecords[currency]
              : child.priceRecords[currency],
            brand: "Goodearth",
            position: position + i + 1,
            variant: child.size || "",
            dimension12: child?.color
          }
        );
        product.push(childProduct);
      });
      // skus = skus.slice(1);
      // variants = variants.slice(1);
      // prices = prices.slice(1);
    });
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({ ecommerce: null });
      dataLayer.push({
        event: "productImpression",
        ecommerce: {
          currencyCode: currency,
          impressions: product
        }
      });
    }
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
      // let skus = "";
      // let variants = "";
      // let prices = "";
      prod.childAttributes.map((child: any) => {
        // skus += "," + child.sku;
        // variants += "," + child.size;
        // prices +=
        //   "," +
        //   (child.discountedPriceRecords
        //     ? child.discountedPriceRecords[currency]
        //     : child.priceRecords[currency]);

        const childProduct = Object.assign(
          {},
          {
            name: prod.title,
            id: child.sku,
            category: category,
            list: listPath,
            price: child.discountedPriceRecords
              ? child.discountedPriceRecords[currency]
              : child.priceRecords[currency],
            brand: "Goodearth",
            position: position + i + 1,
            variant: child.size || "",
            dimension12: child?.color
          }
        );
        product.push(childProduct);
      });
      // skus = skus.slice(1);
      // variants = variants.slice(1);
      // prices = prices.slice(1);
    });
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({ ecommerce: null });
      dataLayer.push({
        event: "productImpression",
        ecommerce: {
          currencyCode: currency,
          impressions: product
        }
      });
    }
  } catch (e) {
    console.log(e);
    console.log("Impression error");
  }
}

export function plpProductClick(
  data: any,
  list: any,
  currency: Currency,
  position?: any,
  isSale?: boolean
) {
  try {
    const products: any = [];
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
    const attr = data?.childAttributes.map((child: any) => {
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
          variant: child.size || "",
          dimension12: child?.color
        }
      );
    });

    const cat1 = data.categories?.[0]?.split(">");
    const cat2 = data.categories?.[1]?.split(">");

    const L1 = cat1?.[0]?.trim();

    const L2 = cat1?.[1] ? cat1?.[1]?.trim() : cat2?.[1]?.trim();

    const L3 = cat2?.[2]
      ? cat2?.[2]?.trim()
      : data.categories?.[2]?.split(">")?.[2]?.trim();

    const search = CookieService.getCookie("search") || "";
    const clickType = localStorage.getItem("clickType");

    const sizes = data.childAttributes?.map((ele: any) => ele.size)?.join("|");

    const childAttr =
      //  data?.childAttributes.map((child: any, index: number) => {
      Object.assign(
        {},
        {
          item_id: data.id, //Pass the product id
          item_name: data.title,
          affiliation: "NA",
          coupon: "NA", // Pass the coupon if available
          currency: currency, // Pass the currency code
          discount:
            isSale && data.discountedPriceRecords
              ? data?.badgeType == "B_flat"
                ? data.discountedPriceRecords[currency]
                : data.priceRecords[currency] -
                  data.discountedPriceRecords[currency]
              : "NA", // Pass the discount amount
          index: "NA",
          item_brand: "goodearth",
          collection_category: data.collections?.join("|"),
          price: data.priceRecords[currency],
          quantity: 1,
          item_category: L1,
          item_category2: L2,
          item_category3: L3,
          item_category4: "NA",
          item_category5: "NA",
          item_list_id: "NA",
          item_list_name: search ? `${clickType}-${search}` : "NA",
          item_variant: sizes,
          price_range: "NA"
        }
      );
    // });
    const listPath = `${list}`;
    CookieService.setCookie("listPath", listPath);
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "productClick",
        ecommerce: {
          currencyCode: currency,
          click: {
            actionField: { list: listPath },
            products: products.concat(attr)
          }
        }
      });
      dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      dataLayer.push({
        event: "select_item",
        ecommerce: {
          items: [childAttr]
        }
      });
    }
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
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "promotionClick",
        ecommerce: {
          promoClick: {
            promotions: promotions
          }
        }
      });
    }
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
      // let skus = "";
      // let variants = "";
      // let prices = "";
      prod.childAttributes.map((child: any) => {
        // skus += "," + child.sku;
        // variants += "," + child.size;
        // prices +=
        //   "," +
        //   (child.discountedPriceRecords
        //     ? child.discountedPriceRecords[currency]
        //     : child.priceRecords[currency]);

        const childProduct = Object.assign(
          {},
          {
            name: prod.title,
            id: child.sku,
            category: category,
            list: listPath,
            price: child.discountedPriceRecords
              ? child.discountedPriceRecords[currency]
              : child.priceRecords[currency],
            brand: "Goodearth",
            position: position + i + 1,
            variant: child.size || "",
            dimension12: child?.color
          }
        );
        product.push(childProduct);
      });
      // skus = skus.slice(1);
      // variants = variants.slice(1);
      // prices = prices.slice(1);
    });
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({ ecommerce: null });
      dataLayer.push({
        event: "productImpression",
        ecommerce: {
          currencyCode: currency,
          impressions: product
        }
      });
    }
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
  const products: any = [];
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
  const attr = data?.childAttributes.map((child: any) => {
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
        position: position,
        dimension12: child?.color
      }
    );
  });
  const listPath = `${list}`;
  CookieService.setCookie("listPath", listPath);
  const userConsent = CookieService.getCookie("consent").split(",");
  if (userConsent.includes(GA_CALLS)) {
    dataLayer.push({
      event: "productClick",
      ecommerce: {
        currencyCode: currency,
        click: {
          actionField: { list: listPath },
          products: products.concat(attr)
        }
      }
    });
  }
}

export function errorTracking(errorMessage: string[], url: string) {
  try {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "errorMessage",
        "Error Message": errorMessage,
        "Error URL": url
      });
    }
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
  text: string | JSX.Element,
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
  basket: Basket,
  paymentMethod?: string,
  gstNo?: string,
  billingAddressId?: number,
  deliveryText?: string
) => {
  const productList = productForBasketGa(basket, currency);
  const itemList = dataForBilling(basket, currency);
  const fbproductData = productForGa(basket);
  const totalId = basket.lineItems.map(prod => {
    return {
      id: prod.product.childAttributes[0].sku
    };
  });
  const userConsent = CookieService.getCookie("consent").split(",");
  if (userConsent.includes(GA_CALLS)) {
    if (step == 1) {
      dataLayer.push({
        event: "initiate_checkout",
        total_amount: basket.total,
        currencyCode: currency,
        total_item: basket.lineItems.length,
        content_ids: totalId,
        contents: fbproductData
      });
    }
    if (step == 3) {
      dataLayer.push({
        event: "payment_info",
        total_amount: basket.total,
        currencyCode: currency,
        total_item: basket.lineItems.length,
        content_ids: totalId,
        contents: fbproductData
      });

      dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      dataLayer.push({
        event: "add_billing_info",
        previous_page_url: CookieService.getCookie("prevUrl"),
        billing_address: billingAddressId,
        gst_invoice: gstNo ? "YES" : "NO",
        delivery_instruction: deliveryText ? "Yes" : "No", //Pass NA if not applicable the mome
        ecommerce: {
          currency: currency, // Pass the currency code
          value: basket.total,
          coupon: "NA",
          items: itemList
        }
      });
    }
  }
  // if(step == 4) {
  //   dataLayer.push({
  //     event: "checkout",
  //     ecommerce: {
  //       currencyCode: currency,
  //       paymentMethod,
  //       checkout: {
  //         actionField: { step, option:  'Payment confirmation'},
  //         products: productList
  //       }
  //     }
  //   });
  // }

  if (paymentMethod) {
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "checkout",
        ecommerce: {
          currencyCode: currency,
          paymentMethod,
          checkout: {
            actionField: { step, option: checkoutSteps[step - 1] },
            products: productList
          }
        }
      });
    }
  } else {
    if (userConsent.includes(GA_CALLS)) {
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
    }
  }
};

export const headerClickGTM = (
  clickType: string,
  location: "Top" | "Bottom",
  mobile: boolean,
  isLoggedIn: boolean
) => {
  try {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "Header Click",
        clickType,
        location,
        device: mobile ? "mobile" : "desktop",
        userStatus: isLoggedIn ? "logged in" : "logged out"
      });
    }
  } catch (e) {
    console.log("Header click GTM error!");
  }
};

export const footerClickGTM = (
  clickType: string,
  location: "Top" | "Bottom",
  isLoggedIn: boolean
) => {
  try {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "Footer Click",
        clickType,
        location,
        userStatus: isLoggedIn ? "logged in" : "logged out"
      });
    }
  } catch (e) {
    console.log("Footer click GTM error!");
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
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
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
    }
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
    const userConsent = CookieService.getCookie("consent").split(",");

    if (userConsent.includes(GA_CALLS)) {
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
      if (userConsent.includes(GA_CALLS)) {
        Moengage.track_event(eventName, {
          "Category Name": l1
        });
      }
    }

    if (userConsent.includes(GA_CALLS)) {
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
    }
  } catch (e) {
    console.log("Menu Navigation GTM error!");
  }
};

export const encrypttext = (message: string) => {
  if (typeof message != "string" || !__EnableCrypto__) return message;
  let key = "AAAAAAAAAAAAAAAA"; //key used in Python
  key = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.AES.encrypt(message, key, {
    mode: CryptoJS.mode.ECB
  });
  return encrypted.toString();
};

export const decripttext = (encrypted: string, force = false) => {
  if (typeof encrypted != "string" || (!__EnableCrypto__ && !force))
    return encrypted;
  let key = "AAAAAAAAAAAAAAAA"; //key used in Python
  key = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    mode: CryptoJS.mode.ECB
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const encryptdata = (data: any) => {
  for (const key in data) {
    if (typeof data[key] == "string") data[key] = encrypttext(data[key]);
    if (isObject(data[key])) data[key] = encryptdata(data[key]);
  }
  return { ...data };
};

export const decriptdata = (data: any) => {
  for (const key in data) {
    if (typeof data[key] == "string") data[key] = decripttext(data[key]);
    if (isObject(data[key])) data[key] = decriptdata(data[key]);
  }
  return { ...data };
};

export const pageViewGTM = (Title: string) => {
  try {
    const userConsent = CookieService.getCookie("consent").split(",");
    const userInfo = JSON.parse(CookieService.getCookie("user") || "{}");

    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "pageview",
        Email: userInfo.email ? sha256(userInfo.email) : "",
        "First Name": userInfo.firstName ? sha256(userInfo.firstName) : "",
        "Last Name": userInfo.lastName ? sha256(userInfo.lastName) : "",
        Phone: userInfo.phoneNumber ? sha256(userInfo.phoneNumber) : "",
        "External ID": userInfo.email ? sha256(userInfo.email) : "",
        Gender: userInfo.gender ? sha256(userInfo.gender) : "",
        Birthdate: userInfo.dob ? sha256(userInfo.dob) : "", //format will be this before hashing - 19910526 for May 26, 1991.
        City: "", // Lowercase with any spaces removed before hashing.
        "State or Province": userInfo.state
          ? sha256(userInfo.state?.toLowerCase())
          : "", // Lowercase two-letter state or province code before hashing.
        "Zip or Postal Code": userInfo.pincode ? sha256(userInfo.pincode) : "", //String
        Country: userInfo.country ? sha256(userInfo.country) : "",
        Page: {
          path: location.pathname,
          Title
        }
      });
    }
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
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "View Selection",
        clickType
      });
    }
  } catch (e) {
    console.log("View Selection GTM error!");
  }
};

export const sortGTM = (clickType: string) => {
  try {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "Sort",
        clickType,
        url: `${location.pathname}${location.search}`
      });
    }
  } catch (e) {
    console.log("Sort GTM error!");
  }
};

export const footerGTM = (
  clickType: string,
  isLoggedIn?: boolean,
  url?: string
) => {
  try {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      setTimeout(() => {
        dataLayer.push({
          event: "Footer Navigation",
          clickType,
          url: `${__DOMAIN__}${location.pathname}`
        });
      }, 1000);
      if (clickType?.toLowerCase() == "good earth registry") {
        dataLayer.push({
          event: "ge_create_my_registry_click",
          user_status: isLoggedIn ? "Logged in" : "Guest",
          click_url: url
        });
      }
    }
  } catch (e) {
    console.log("Footer Navigation GTM error!");
  }
};

export const announcementBarGTM = (clickText: string, clickUrl: string) => {
  try {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "Announcement Bar Click",
        clickText,
        clickUrl,
        url: `${location.pathname}${location.search}`
      });
    }
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

export function getPageType() {
  let pageType = "Home";
  const isPDP =
    location.pathname.includes("/catalogue/") &&
    !location.pathname.includes("/catalogue/category");
  const isPLP = location.pathname.includes("/catalogue/category");
  const isCart = location.pathname.includes("/cart");
  const isCategoryLanding = location.pathname.includes("/category_landing");
  const isCollectionLanding = location.pathname.includes("/allcollection");
  const isCollectionListing = location.pathname.includes("/collection");
  if (isPDP) {
    pageType = "PDP";
  } else if (isPLP) {
    pageType = "PLP";
  } else if (isCart) {
    pageType = "Cart";
  } else if (isCategoryLanding) {
    pageType = "Category Landing";
  } else if (isCollectionLanding) {
    pageType = "Collection Landing";
  } else if (isCollectionListing) {
    pageType = "Collection Listing";
  } else if (
    location.pathname.includes("/order/checkout") ||
    location.pathname.includes("/order/gc_checkout")
  ) {
    pageType = "Checkout";
  } else if (location.pathname.includes("/order/orderconfirmation")) {
    pageType = "Order Confirmation";
  } else if (location.pathname.includes("/account")) {
    pageType = "Account";
  }
  return pageType;
}

export const validURL = (str: string) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
};

export const closeKeyBoardMobile = async () => {
  const field = document.createElement("input");
  field.setAttribute("type", "text");
  document.body.appendChild(field);
  await new Promise((resolve, reject) =>
    setTimeout(function() {
      field.focus();
      setTimeout(function() {
        field.setAttribute("style", "display:none;");
        resolve(true);
      }, 400);
    }, 400)
  );
};
