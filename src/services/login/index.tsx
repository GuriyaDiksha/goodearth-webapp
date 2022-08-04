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
import * as util from "../../utils/validate";
import { Basket } from "typings/basket";
import { updateRegion } from "actions/widget";
// import { updateBasket } from "actions/basket";
// import { CUST } from "constants/util";

export default {
  showForgotPassword: function(
    dispatch: Dispatch,
    event?: React.MouseEvent
  ): void {
    dispatch(updateComponent(POPUP.FORGOTPASSWORDFORM, null, true));
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
      `${__API_HOST__ + "/myapi/auth/check_user_password/"}`,
      {
        email
      }
    );
    return res;
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

    const res = await API.post<loginResponse>(
      dispatch,
      `${__API_HOST__}/myapi/auth/login/${source ? "?source=" + source : ""}`,
      {
        email: email,
        password: password,
        boId: boId
      }
    );
    CookieService.setCookie("atkn", res.token, 365);
    CookieService.setCookie("userId", res.userId, 365);
    CookieService.setCookie("email", res.email, 365);
    CookieService.setCookie(
      "custGrp",
      res.customerGroup ? res.customerGroup.toLowerCase() : "",
      365
    );
    util.showGrowlMessage(dispatch, `${res.firstName}, ${LOGIN_SUCCESS}`, 5000);
    if (res.oldBasketHasItems) {
      util.showGrowlMessage(dispatch, MESSAGE.PREVIOUS_BASKET, 0);
    }
    if (
      (res.updated || res.publishRemove) &&
      res.updatedRemovedItems &&
      res.updatedRemovedItems.length > 0
    ) {
      util.showGrowlMessage(
        dispatch,
        MESSAGE.PRODUCT_UNPUBLISHED,
        0,
        undefined,
        res.updatedRemovedItems
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
    dispatch(updateCookies({ tkn: res.token }));
    dispatch(
      updateUser({ isLoggedIn: true, customerGroup: res.customerGroup || "" })
    );

    // HeaderService.fetchHomepageData(dispatch);
    HeaderService.fetchHeaderDetails(
      dispatch,
      currency,
      res.customerGroup
    ).catch(err => {
      console.log("FOOTER API ERROR ==== " + err);
    });
    const metaResponse = await MetaService.updateMeta(dispatch, {
      tkn: res.token
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
          util.checkoutGTM(1, metaResponse?.currency || "INR", basketRes);
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
            util.showGrowlMessage(
              dispatch,
              MESSAGE.REGISTRY_OWNER_CHECKOUT,
              6000
            );
          }
          let item1 = false,
            item2 = false;
          basketRes.lineItems.map(data => {
            if (!data.bridalProfile) item1 = true;
            if (data.bridalProfile) item2 = true;
          });
          if (item1 && item2) {
            util.showGrowlMessage(
              dispatch,
              MESSAGE.REGISTRY_MIXED_SHIPPING,
              6000
            );
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
    const res = await API.post<loginResponse>(
      dispatch,
      `${__API_HOST__}/myapi/auth/sociallogin/${
        source ? "?source=" + source : ""
      }`,
      formdata
    );
    CookieService.setCookie("atkn", res.token, 365);
    CookieService.setCookie("userId", res.userId, 365);
    CookieService.setCookie("email", res.email, 365);
    CookieService.setCookie(
      "custGrp",
      res.customerGroup ? res.customerGroup.toLowerCase() : "",
      365
    );
    util.showGrowlMessage(dispatch, `${res.firstName}, ${LOGIN_SUCCESS}`, 5000);
    if (res.oldBasketHasItems) {
      util.showGrowlMessage(dispatch, MESSAGE.PREVIOUS_BASKET, 0);
    }
    if (
      (res.updated || res.publishRemove) &&
      res.updatedRemovedItems &&
      res.updatedRemovedItems.length > 0
    ) {
      util.showGrowlMessage(
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
          util.checkoutGTM(1, metaResponse?.currency || "INR", basketRes);
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
            util.showGrowlMessage(
              dispatch,
              MESSAGE.REGISTRY_OWNER_CHECKOUT,
              6000
            );
          }
          let item1 = false,
            item2 = false;
          basketRes.lineItems.map(data => {
            if (!data.bridalProfile) item1 = true;
            if (data.bridalProfile) item2 = true;
          });
          if (item1 && item2) {
            util.showGrowlMessage(
              dispatch,
              MESSAGE.REGISTRY_MIXED_SHIPPING,
              6000
            );
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
      // document.cookie =
      //   "cerisepopup=; expires=THu, 01 Jan 1970 00:00:01 GMT; path=/";
      // RESET CURRENCY TO DEFAULT INR
      // CookieService.setCookie("currency", "INR", 365);
      // dispatch(updateCurrency("INR"));
      dispatch(updateCookies({ tkn: "" }));
      MetaService.updateMeta(dispatch, {}).catch(err => {
        console.log(err);
      });
      Moengage.destroy_session();
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
      util.showGrowlMessage(dispatch, MESSAGE.LOGOUT_SUCCESS, 5000);
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
    util.showGrowlMessage(
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
    const res = await API.post<registerResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/auth/register/"}`,
      formData
    );
    // CookieService.setCookie("atkn", res.token, 365);
    // CookieService.setCookie("userId", res.userId, 365);
    // CookieService.setCookie("email", res.email, 365);
    // util.showGrowlMessage(dispatch, `${res.firstName}, ${LOGIN_SUCCESS}`, 5000);
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
    //     util.checkoutGTM(1, metaResponse?.currency || "INR", res);
    //   }
    // });
    return res;
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
    CookieService.setCookie("currency", formData.currency, 365);
    dispatch(updateCurrency(formData.currency));
    const {
      publishRemove,
      updatedRemovedItems,
      unshippableRemove,
      unshippableProducts
    } = res;
    if (publishRemove) {
      util.showGrowlMessage(
        dispatch,
        MESSAGE.PRODUCT_UNPUBLISHED,
        0,
        undefined,
        updatedRemovedItems
      );
    }
    if (unshippableRemove) {
      util.showGrowlMessage(
        dispatch,
        MESSAGE.PRODUCT_UNSHIPPABLE_REMOVED,
        0,
        undefined,
        unshippableProducts
      );
    }
    // dispatch(updateBasket(res));
    return res;
  },
  reloadPage: (
    dispatch: Dispatch,
    currency: Currency,
    customerGroup: string
  ) => {
    HeaderService.fetchHeaderDetails(dispatch, currency, customerGroup).catch(
      err => {
        console.log("FOOTER API ERROR ==== " + err);
      }
    );
    HeaderService.fetchFooterDetails(dispatch).catch(err => {
      console.log("FOOTER API ERROR ==== " + err);
    });
    // HeaderService.fetchHomepageData(dispatch).catch(err => {
    //   console.log("Homepage API ERROR ==== " + err);
    // });
    Api.getAnnouncement(dispatch).catch(err => {
      console.log("FOOTER API ERROR ==== " + err);
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
          console.log("region data====", data?.continent_name);
          CookieService.setCookie("region", data?.continent_name, 365);
          dispatch(updateRegion(data?.continent_name));

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
            resolve("error");
          }
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
      email
    });
    return res;
  },
  verifyUserOTP: async (dispatch: Dispatch, email: string, otp: string) => {
    const res = await API.post<{
      success: boolean;
      expired: boolean;
      email: string;
      message: string;
    }>(dispatch, `${__API_HOST__}/myapi/customer/verify_user_otp/`, {
      email,
      otp
    });
    return res;
  }
};
