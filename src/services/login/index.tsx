import React from "react";
import { Dispatch } from "redux";
import API from "utils/api";
import {
  logoutResponse,
  checkUserPasswordResponse,
  resetPasswordResponse,
  loginResponse,
  registerResponse,
  countryDataResponse
} from "./typings";
import { updateCookies } from "actions/cookies";
import { updateComponent, updateModal } from "../../actions/modal";
import CookieService from "services/cookie";
import { updateUser, resetMeta } from "actions/user";
import MetaService from "services/meta";
import WishlistService from "services/wishlist";
import BasketService from "services/basket";
import CacheService from "services/cache";
import HeaderService from "services/headerFooter";
import CheckoutService from "services/checkout";
import Api from "services/api";
import { Currency } from "typings/currency";
import { updateCurrency } from "actions/currency";
import { LOGIN_SUCCESS, MESSAGE } from "constants/messages";
// import Axios from "axios";
import { POPUP } from "constants/components";
import { showGrowlMessage, checkoutGTM } from "../../utils/validate";
import { Basket } from "typings/basket";
import { updateRegion } from "actions/widget";
import { GA_CALLS } from "constants/cookieConsent";
import { encryptdata, decriptdata, encrypttext } from "utils/validate";
// import { updateBasket } from "actions/basket";
// import { CUST } from "constants/util";

export default {
  showForgotPassword: function(
    dispatch: Dispatch,
    email?: string,
    event?: React.MouseEvent
  ): void {
    dispatch(updateComponent(POPUP.FORGOTPASSWORDFORM, { email }, true));
    dispatch(updateModal(true));
  },
  showLogin: function(dispatch: Dispatch, event?: React.MouseEvent): void {
    dispatch(updateComponent(POPUP.LOGINFORM, null, true));
    dispatch(updateModal(true));
  },
  showRegister: function(dispatch: Dispatch, event?: React.MouseEvent): void {
    dispatch(updateComponent(POPUP.REGISTERFORM, null, true));
    dispatch(updateModal(true));
  },
  checkUserPassword: async function(dispatch: Dispatch, email: string) {
    const res = await API.post<checkUserPasswordResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/auth/check_user/"}`,
      {
        email: encrypttext(email)
      }
    );
    const response = decriptdata(res);
    return response;
  },
  resetPassword: async function(dispatch: Dispatch, formData: FormData) {
    const res = await API.post<resetPasswordResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/auth/reset_password/"}`,
      formData
    );
    return res;
  },
  login: async function(
    dispatch: Dispatch,
    email: string,
    password: string,
    currency: Currency,
    source?: string,
    history?: any,
    sortBy?: string
  ) {
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const boId = urlParams.get("bo_id");
    console.log("source:", source);
    if (location.pathname == "/giftcard") {
      source = "giftcard";
    }

    const res = await API.post<loginResponse>(
      dispatch,
      `${__API_HOST__}/myapi/auth/login/${source ? "?source=" + source : ""}`,
      {
        email: encrypttext(email),
        password: encrypttext(password),
        boId: boId ? encrypttext(boId) : boId
      }
    );
    const response = decriptdata(res);
    CookieService.setCookie("atkn", response.token, 365);
    CookieService.setCookie("userId", response.userId, 365);
    CookieService.setCookie("email", response.email, 365);
    CookieService.setCookie(
      "custGrp",
      res.customerGroup ? res.customerGroup.toLowerCase() : "",
      365
    );
    showGrowlMessage(dispatch, `${LOGIN_SUCCESS} ${response.firstName}!`, 5000);
    if (response.oldBasketHasItems) {
      showGrowlMessage(dispatch, MESSAGE.PREVIOUS_BASKET, 0);
    }
    if (
      (response.updated || response.publishRemove) &&
      response.updatedRemovedItems &&
      response.updatedRemovedItems.length > 0
    ) {
      showGrowlMessage(
        dispatch,
        MESSAGE.PRODUCT_UNPUBLISHED,
        0,
        undefined,
        response.updatedRemovedItems
      );
    }
    // if (
    //   (res.customerGroup == CUST.CERISE ||
    //     res.customerGroup == CUST.CERISE_SITARA) &&
    //   currency == "INR"
    // ) {
    //   dispatch(updateComponent(POPUP.CERISE, undefined, true));
    //   dispatch(updateModal(true));
    //   sessionStorage.setItem("cerisedbl", "1");
    // } else {
    //   dispatch(updateModal(false));
    // }
    dispatch(updateModal(false));
    dispatch(updateCookies({ tkn: response.token }));
    dispatch(
      updateUser({
        isLoggedIn: true,
        customerGroup: response.customerGroup || ""
      })
    );

    // HeaderService.fetchHomepageData(dispatch);
    HeaderService.fetchHeaderDetails(
      dispatch,
      currency,
      response.customerGroup
    ).catch(err => {
      console.log("FOOTER API ERROR ==== " + err);
    });
    const metaResponse = await MetaService.updateMeta(dispatch, {
      tkn: response.token
    });
    WishlistService.updateWishlist(dispatch, sortBy);
    Api.getAnnouncement(dispatch).catch(err => {
      console.log("Announcement API ERROR ==== " + err);
    });
    Api.getSalesStatus(dispatch).catch(err => {
      console.log("Sales Api Status ==== " + err);
    });
    Api.getPopups(dispatch).catch(err => {
      console.log("Popups Api ERROR === " + err);
    });
    BasketService.fetchBasket(dispatch, source, history, true).then(
      basketRes => {
        if (source == "checkout") {
          checkoutGTM(1, metaResponse?.currency || "INR", basketRes);
          // call loyalty point api only one time after login
          const data: any = {
            email: res.email
          };
          CheckoutService.getLoyaltyPoints(dispatch, data).then(loyalty => {
            dispatch(updateUser({ loyaltyData: loyalty }));
          });
        }
        if (metaResponse) {
          let basketBridalId = 0;
          basketRes.lineItems.map(item =>
            item.bridalProfile ? (basketBridalId = item.bridalProfile) : ""
          );
          if (basketBridalId && basketBridalId == metaResponse.bridalId) {
            showGrowlMessage(dispatch, MESSAGE.REGISTRY_OWNER_CHECKOUT, 6000);
          }
          let item1 = false,
            item2 = false;
          basketRes.lineItems.map(data => {
            if (!data.bridalProfile) item1 = true;
            if (data.bridalProfile) item2 = true;
          });
          if (item1 && item2) {
            showGrowlMessage(dispatch, MESSAGE.REGISTRY_MIXED_SHIPPING, 6000);
          }
        }
      }
    );
    return res;
  },
  authLogin: async function(
    dispatch: Dispatch,
    email: string,
    password: string
  ) {
    const res = await API.post<loginResponse>(
      dispatch,
      `${__API_HOST__}/myapi/auth/login_for_employee/`,
      {
        email: email,
        password: password
      }
    );
    return res;
  },
  loginSocial: async function(
    dispatch: Dispatch,
    formdata: any,
    currency: Currency,
    source: string,
    history: any,
    sortBy?: string
  ) {
    const olddata = { ...formdata };
    const enc = encryptdata(olddata);
    const response = await API.post<loginResponse>(
      dispatch,
      `${__API_HOST__}/myapi/auth/sociallogin/${
        source ? "?source=" + source : ""
      }`,
      enc
    );
    const res = decriptdata(response);
    CookieService.setCookie("atkn", res.token, 365);
    CookieService.setCookie("userId", res.userId, 365);
    CookieService.setCookie("email", res.email, 365);
    CookieService.setCookie(
      "custGrp",
      res.customerGroup ? res.customerGroup.toLowerCase() : "",
      365
    );
    showGrowlMessage(dispatch, `${res.firstName}, ${LOGIN_SUCCESS}`, 5000);
    if (res.oldBasketHasItems) {
      showGrowlMessage(dispatch, MESSAGE.PREVIOUS_BASKET, 0);
    }
    if (
      (res.updated || res.publishRemove) &&
      res.updatedRemovedItems &&
      res.updatedRemovedItems.length > 0
    ) {
      showGrowlMessage(
        dispatch,
        MESSAGE.PRODUCT_UNPUBLISHED,
        0,
        undefined,
        res.updatedRemovedItems
      );
    }
    dispatch(updateModal(false));
    dispatch(updateCookies({ tkn: res.token }));
    dispatch(
      updateUser({ isLoggedIn: true, customerGroup: res.customerGroup || "" })
    );
    // if (
    //   (res.customerGroup == CUST.CERISE ||
    //     res.customerGroup == CUST.CERISE_SITARA) &&
    //   currency == "INR"
    // ) {
    //   dispatch(updateComponent(POPUP.CERISE, undefined, true));
    //   dispatch(updateModal(true));
    //   sessionStorage.setItem("cerisedbl", "1");
    // } else {
    //   dispatch(updateModal(false));
    // }
    dispatch(updateModal(false));
    MetaService.updateMeta(dispatch, { tkn: res.token });
    Api.getSalesStatus(dispatch).catch(err => {
      console.log("Sales Api Status ==== " + err);
    });
    Api.getPopups(dispatch).catch(err => {
      console.log("Popups Api ERROR === " + err);
    });
    Api.getAnnouncement(dispatch).catch(err => {
      console.log("Announcement API ERROR ==== " + err);
    });
    WishlistService.updateWishlist(dispatch, sortBy);
    const metaResponse = await MetaService.updateMeta(dispatch, {
      tkn: res.token
    });
    BasketService.fetchBasket(dispatch, source, history, true).then(
      basketRes => {
        if (source == "checkout") {
          checkoutGTM(1, metaResponse?.currency || "INR", basketRes);
          // call loyalty point api only one time after login
          const data: any = {
            email: res.email
          };
          CheckoutService.getLoyaltyPoints(dispatch, data).then(loyalty => {
            dispatch(updateUser({ loyaltyData: loyalty }));
          });
        }
        if (metaResponse) {
          let basketBridalId = 0;
          basketRes.lineItems.map(item =>
            item.bridalProfile ? (basketBridalId = item.bridalProfile) : ""
          );
          if (basketBridalId && basketBridalId == metaResponse.bridalId) {
            showGrowlMessage(dispatch, MESSAGE.REGISTRY_OWNER_CHECKOUT, 6000);
          }
          let item1 = false,
            item2 = false;
          basketRes.lineItems.map(data => {
            if (!data.bridalProfile) item1 = true;
            if (data.bridalProfile) item2 = true;
          });
          if (item1 && item2) {
            showGrowlMessage(dispatch, MESSAGE.REGISTRY_MIXED_SHIPPING, 6000);
          }
        }
      }
    );
    return res;
  },
  logout: async function(
    dispatch: Dispatch,
    currency: Currency,
    customerGroup: string,
    source?: string
  ) {
    const res = await API.post<logoutResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/auth/logout/"}`,
      {}
    );
    if (res) {
      document.cookie = "atkn=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
      document.cookie =
        "userId=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
      document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
      document.cookie =
        "custGrp=; expires=THu, 01 Jan 1970 00:00:01 GMT; path=/";
      document.cookie = "user=; expires=THu, 01 Jan 1970 00:00:01 GMT; path=/";
      // document.cookie =
      //   "cerisepopup=; expires=THu, 01 Jan 1970 00:00:01 GMT; path=/";
      // RESET CURRENCY TO DEFAULT INR
      // CookieService.setCookie("currency", "INR", 365);
      // dispatch(updateCurrency("INR"));
      dispatch(updateCookies({ tkn: "" }));
      MetaService.updateMeta(dispatch, {}).catch(err => {
        console.log(err);
      });

      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        Moengage.destroy_session();
      }
      WishlistService.resetWishlist(dispatch);
      Api.getSalesStatus(dispatch).catch(err => {
        console.log("Sales Api Status ==== " + err);
      });
      HeaderService.fetchHeaderDetails(dispatch, currency, customerGroup).catch(
        err => {
          console.log("FOOTER API ERROR ==== " + err);
        }
      );
      Api.getAnnouncement(dispatch).catch(err => {
        console.log("Announcement API ERROR ==== " + err);
      });
      Api.getPopups(dispatch).catch(err => {
        console.log("Popups Api ERROR === " + err);
      });
      BasketService.fetchBasket(dispatch, source).catch(err => {
        console.log(err);
      });
      // HeaderService.fetchHomepageData(dispatch);
      dispatch(resetMeta(undefined));
      if (source == "reset-pass") {
        showGrowlMessage(dispatch, MESSAGE.INVALID_SESSION_LOGOUT, 5000);
      } else {
        showGrowlMessage(dispatch, MESSAGE.LOGOUT_SUCCESS, 5000);
      }
      return res;
    }
  },
  logoutClient: async function(dispatch: Dispatch) {
    document.cookie = "atkn=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    document.cookie = "custGrp=; expires=THu, 01 Jan 1970 00:00:01 GMT; path=/";
    // document.cookie =
    //   "cerisepopup=; expires=THu, 01 Jan 1970 00:00:01 GMT; path=/";
    dispatch(updateCookies({ tkn: "" }));
    MetaService.updateMeta(dispatch, {});
    WishlistService.resetWishlist(dispatch);
    Api.getSalesStatus(dispatch).catch(err => {
      console.log("Sales Api Status ==== " + err);
    });
    HeaderService.fetchHeaderDetails(dispatch).catch(err => {
      console.log("FOOTER API ERROR ==== " + err);
    });
    Api.getAnnouncement(dispatch).catch(err => {
      console.log("Announcement API ERROR ==== " + err);
    });
    Api.getPopups(dispatch).catch(err => {
      console.log("Popups Api ERROR === " + err);
    });
    BasketService.fetchBasket(dispatch);
    dispatch(resetMeta(undefined));
    showGrowlMessage(
      dispatch,
      MESSAGE.INVALID_SESSION_LOGOUT,
      5000,
      "INVALID_SESSION_LOGOUT"
    );
  },
  register: async function(
    dispatch: Dispatch,
    formData: FormData,
    source?: string,
    sortBy?: string
  ) {
    const olddata = { ...formData };
    const enc = encryptdata(olddata);
    const res = await API.post<registerResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/auth/register/"}`,
      enc
    );
    // CookieService.setCookie("atkn", res.token, 365);
    // CookieService.setCookie("userId", res.userId, 365);
    // CookieService.setCookie("email", res.email, 365);
    // showGrowlMessage(dispatch, `${res.firstName}, ${LOGIN_SUCCESS}`, 5000);
    // dispatch(updateCookies({ tkn: res.token }));
    // dispatch(updateUser({ isLoggedIn: true }));
    // dispatch(updateModal(false));
    // const metaResponse = await MetaService.updateMeta(dispatch, {
    //   tkn: res.token
    // });
    // HeaderService.fetchHomepageData(dispatch);
    // WishlistService.updateWishlist(dispatch, sortBy);
    // BasketService.fetchBasket(dispatch).then(res => {
    //   if (source == "checkout") {
    //     checkoutGTM(1, metaResponse?.currency || "INR", res);
    //   }
    // });
    const response = decriptdata(res);
    return response;
  },
  changeCurrency: async function(
    dispatch: Dispatch,
    formData: { currency: Currency }
  ) {
    const res: any = await API.post<Basket>(
      dispatch,
      `${__API_HOST__ + "/myapi/basket/change_currency/"}`,
      formData
    );
    // res will be object only when API gives 200 response
    if (typeof res === "object" && res !== null) {
      CookieService.setCookie("currency", formData.currency, 365);
      dispatch(updateCurrency(formData.currency));
      const {
        publishRemove,
        updatedRemovedItems,
        unshippableRemove,
        unshippableProducts
      } = res;
      if (publishRemove) {
        showGrowlMessage(
          dispatch,
          MESSAGE.PRODUCT_UNPUBLISHED,
          0,
          undefined,
          updatedRemovedItems
        );
      }
      if (unshippableRemove) {
        showGrowlMessage(
          dispatch,
          MESSAGE.PRODUCT_UNSHIPPABLE_REMOVED,
          0,
          undefined,
          unshippableProducts
        );
      }
    } else {
      console.log("Change currency API error: ", res);
    }
    return res;
  },
  reloadPage: (
    dispatch: Dispatch,
    currency: Currency,
    customerGroup: string
  ) => {
    HeaderService.fetchHeaderDetails(dispatch, currency, customerGroup).catch(
      err => {
        console.log("Fetch header API ERROR ==== " + err);
      }
    );
    HeaderService.fetchFooterDetails(dispatch).catch(err => {
      console.log("Fetch footer API ERROR ==== " + err);
    });
    // HeaderService.fetchHomepageData(dispatch).catch(err => {
    //   console.log("Homepage API ERROR ==== " + err);
    // });
    Api.getAnnouncement(dispatch).catch(err => {
      console.log("Get announcement API ERROR ==== " + err);
    });
    Api.getSalesStatus(dispatch).catch(err => {
      console.log("Sale status API error === " + err);
    });
    Api.getPopups(dispatch).catch(err => {
      console.log("Popups Api ERROR === " + err);
    });
    BasketService.fetchBasket(dispatch);
  },
  getClientIpCurrency: async function(dispatch: Dispatch) {
    // Axios.post(`${__API_HOST__}/myapi/common/count_api_hits/`);
    const response = await new Promise((resolve, reject) => {
      fetch(`https://api.ipdata.co/?api-key=${__IP_DATA_KEY__}`, {
        method: "GET"
      })
        .then(resp => resp.json())
        .then(data => {
          CookieService.setCookie("region", data?.continent_name, 365);
          CookieService.setCookie("ip", data?.ip, 365);
          CookieService.setCookie("country", data?.country_name, 365);
          dispatch(
            updateRegion({
              region: data?.continent_name,
              ip: data?.ip,
              country: data?.country_name
            })
          );

          if (data.currency) {
            if (
              data.currency.code == "INR" ||
              data.currency.code == "GBP" ||
              data.currency.code == "SGD" ||
              data.currency.code == "AED"
            ) {
              resolve(data.currency.code);
            } else {
              resolve("USD");
            }
          } else {
            // CookieService.setCookie("region", "INDIA", 365);
            // CookieService.setCookie("ip", data?.ip, 365);
            dispatch(
              updateRegion({
                region: "India",
                ip: "",
                country: "India"
              })
            );
            CookieService.setCookie("country", "India", 365);
            resolve("error");
          }
        })
        .catch(error => {
          resolve("error");
          console.log(error);
        });
    });
    return response;
  },
  fetchCountryData: async (dispatch: Dispatch) => {
    let countryData: countryDataResponse | [] = [];
    if (typeof document == "undefined") {
      countryData = CacheService.get("countryData") as countryDataResponse;
    }
    if (countryData && countryData.length > 0) {
      return countryData;
    }
    const res = await API.get<countryDataResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/address/countries_state/"}`
    );
    if (typeof document == "undefined") {
      CacheService.set("countryData", res);
    }
    return res;
  },
  sendUserOTP: async (dispatch: Dispatch, email: string) => {
    const res = await API.post<{
      email: string;
      otpSent: boolean;
      message: string;
      alreadyVerified: boolean;
    }>(dispatch, `${__API_HOST__}/myapi/customer/send_user_otp/`, {
      email: encrypttext(email)
    });
    const response = decriptdata(res);
    return response;
  },
  verifyUserOTP: async (
    dispatch: Dispatch,
    email: string,
    otp: string,
    currency?: Currency,
    source?: string,
    sortBy?: string
  ) => {
    const res = await API.post<{
      success: boolean;
      expired: boolean;
      email: string;
      message: string;
      attempts: number;
      maxAttemptsAllow: number;
      token: string; //login response
      userId: string;
      firstName: string;
      lastName: string;
      phoneNo: string;
      gender: string;
      oldBasketHasItems: boolean;
      publishRemove: boolean;
      updated: boolean;
      updatedRemovedItems: string[];
      customerGroup: string;
    }>(dispatch, `${__API_HOST__}/myapi/customer/verify_user_otp/`, {
      email: encrypttext(email),
      otp: encrypttext(otp)
    });
    const response = decriptdata(res);
    if (response?.token) {
      CookieService.setCookie("atkn", response.token, 365);
      CookieService.setCookie("userId", response.userId, 365);
      CookieService.setCookie("email", response.email, 365);
      CookieService.setCookie(
        "custGrp",
        res?.customerGroup ? res?.customerGroup.toLowerCase() : "",
        365
      );
      showGrowlMessage(
        dispatch,
        `${LOGIN_SUCCESS} ${response.firstName}!`,
        5000
      );
      if (response.oldBasketHasItems) {
        showGrowlMessage(dispatch, MESSAGE.PREVIOUS_BASKET, 0);
      }
      if (
        (response.updated || response.publishRemove) &&
        response.updatedRemovedItems &&
        response.updatedRemovedItems.length > 0
      ) {
        showGrowlMessage(
          dispatch,
          MESSAGE.PRODUCT_UNPUBLISHED,
          0,
          undefined,
          response.updatedRemovedItems
        );
      }

      dispatch(updateModal(false));
      dispatch(updateCookies({ tkn: response.token }));
      dispatch(
        updateUser({
          isLoggedIn: true,
          customerGroup: response.customerGroup || ""
        })
      );

      HeaderService.fetchHeaderDetails(
        dispatch,
        currency,
        response.customerGroup
      ).catch(err => {
        console.log("FOOTER API ERROR ==== " + err);
      });
      const metaResponse = await MetaService.updateMeta(dispatch, {
        tkn: response.token
      });
      WishlistService.updateWishlist(dispatch, sortBy);
      Api.getAnnouncement(dispatch).catch(err => {
        console.log("Announcement API ERROR ==== " + err);
      });
      Api.getSalesStatus(dispatch).catch(err => {
        console.log("Sales Api Status ==== " + err);
      });
      Api.getPopups(dispatch).catch(err => {
        console.log("Popups Api ERROR === " + err);
      });
      BasketService.fetchBasket(dispatch, source, history, true).then(
        basketRes => {
          if (source == "checkout") {
            checkoutGTM(1, metaResponse?.currency || "INR", basketRes);
            // call loyalty point api only one time after login
            const data: any = {
              email: res.email
            };
            CheckoutService.getLoyaltyPoints(dispatch, data).then(loyalty => {
              dispatch(updateUser({ loyaltyData: loyalty }));
            });
          }
          if (metaResponse) {
            let basketBridalId = 0;
            basketRes.lineItems.map(item =>
              item.bridalProfile ? (basketBridalId = item.bridalProfile) : ""
            );
            if (basketBridalId && basketBridalId == metaResponse.bridalId) {
              showGrowlMessage(dispatch, MESSAGE.REGISTRY_OWNER_CHECKOUT, 6000);
            }
            let item1 = false,
              item2 = false;
            basketRes.lineItems.map(data => {
              if (!data.bridalProfile) item1 = true;
              if (data.bridalProfile) item2 = true;
            });
            if (item1 && item2) {
              showGrowlMessage(dispatch, MESSAGE.REGISTRY_MIXED_SHIPPING, 6000);
            }
          }
        }
      );
    }
    return response;
  }
};
