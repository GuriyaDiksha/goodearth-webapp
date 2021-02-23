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
import Api from "services/api";
import { Currency } from "typings/currency";
import { updateCurrency } from "actions/currency";
import {
  INVALID_SESSION_LOGOUT,
  LOGOUT_SUCCESS,
  LOGIN_SUCCESS,
  REGISTRY_OWNER_CHECKOUT,
  REGISTRY_MIXED_SHIPPING
} from "constants/messages";
// import Axios from "axios";
import { POPUP } from "constants/components";
import * as util from "../../utils/validate";

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
        email: email
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
    source?: string
  ) {
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const boId = urlParams.get("bo_id");

    const res = await API.post<loginResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/auth/login/"}`,
      {
        email: email,
        password: password,
        boId: boId
      }
    );
    CookieService.setCookie("atkn", res.token, 365);
    CookieService.setCookie("userId", res.userId, 365);
    CookieService.setCookie("email", res.email, 365);
    util.showGrowlMessage(dispatch, `${res.firstName}, ${LOGIN_SUCCESS}`, 5000);
    dispatch(updateCookies({ tkn: res.token }));
    dispatch(updateUser({ isLoggedIn: true }));
    dispatch(updateModal(false));
    const metaResponse = await MetaService.updateMeta(dispatch, {
      tkn: res.token
    });
    WishlistService.updateWishlist(dispatch);
    BasketService.fetchBasket(dispatch, source).then(res => {
      if (source == "checkout") {
        util.checkoutGTM(1, metaResponse?.currency || "INR", res);
      }
      if (metaResponse) {
        let basketBridalId = 0;
        res.lineItems.map(item =>
          item.bridalProfile ? (basketBridalId = item.bridalProfile) : ""
        );
        if (basketBridalId && basketBridalId == metaResponse.bridalId) {
          util.showGrowlMessage(dispatch, REGISTRY_OWNER_CHECKOUT, 6000);
        }
        let item1 = false,
          item2 = false;
        res.lineItems.map(data => {
          if (!data.bridalProfile) item1 = true;
          if (data.bridalProfile) item2 = true;
        });
        if (item1 && item2) {
          util.showGrowlMessage(dispatch, REGISTRY_MIXED_SHIPPING, 6000);
        }
      }
    });
    return res;
  },
  loginSocial: async function(dispatch: Dispatch, formdata: any) {
    const res = await API.post<loginResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/auth/sociallogin/"}`,
      formdata
    );
    CookieService.setCookie("atkn", res.token, 365);
    CookieService.setCookie("userId", res.userId, 365);
    CookieService.setCookie("email", res.email, 365);
    util.showGrowlMessage(dispatch, `${res.firstName}, ${LOGIN_SUCCESS}`, 5000);
    dispatch(updateCookies({ tkn: res.token }));
    dispatch(updateUser({ isLoggedIn: true }));
    dispatch(updateModal(false));
    MetaService.updateMeta(dispatch, { tkn: res.token });
    WishlistService.updateWishlist(dispatch);
    BasketService.fetchBasket(dispatch);
    return res;
  },
  logout: async function(dispatch: Dispatch) {
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
      // RESET CURRENCY TO DEFAULT INR
      // CookieService.setCookie("currency", "INR", 365);
      // dispatch(updateCurrency("INR"));
      dispatch(updateCookies({ tkn: "" }));
      MetaService.updateMeta(dispatch, {}).catch(err => {
        console.log(err);
      });
      WishlistService.resetWishlist(dispatch);
      BasketService.fetchBasket(dispatch).catch(err => {
        console.log(err);
      });
      dispatch(resetMeta(undefined));
      util.showGrowlMessage(dispatch, LOGOUT_SUCCESS, 5000);
      return res;
    }
  },
  logoutClient: async function(dispatch: Dispatch) {
    document.cookie = "atkn=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    dispatch(updateCookies({ tkn: "" }));
    MetaService.updateMeta(dispatch, {});
    WishlistService.resetWishlist(dispatch);
    BasketService.fetchBasket(dispatch);
    dispatch(resetMeta(undefined));
    util.showGrowlMessage(
      dispatch,
      INVALID_SESSION_LOGOUT,
      5000,
      "INVALID_SESSION_LOGOUT"
    );
  },
  register: async function(
    dispatch: Dispatch,
    formData: FormData,
    source?: string
  ) {
    const res = await API.post<registerResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/auth/register/"}`,
      formData
    );
    CookieService.setCookie("atkn", res.token, 365);
    CookieService.setCookie("userId", res.userId, 365);
    CookieService.setCookie("email", res.email, 365);
    util.showGrowlMessage(dispatch, `${res.firstName}, ${LOGIN_SUCCESS}`, 5000);
    dispatch(updateCookies({ tkn: res.token }));
    dispatch(updateUser({ isLoggedIn: true }));
    dispatch(updateModal(false));
    const metaResponse = await MetaService.updateMeta(dispatch, {
      tkn: res.token
    });
    WishlistService.updateWishlist(dispatch);
    BasketService.fetchBasket(dispatch).then(res => {
      if (source == "checkout") {
        util.checkoutGTM(1, metaResponse?.currency || "INR", res);
      }
    });
    return res;
  },
  changeCurrency: async function(
    dispatch: Dispatch,
    formData: { currency: Currency }
  ) {
    const res: any = await API.post<registerResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/basket/change_currency/"}`,
      formData
    );
    CookieService.setCookie("currency", formData.currency, 365);
    dispatch(updateCurrency(formData.currency));
    return res;
  },
  reloadPage: (dispatch: Dispatch, currency: Currency) => {
    HeaderService.fetchHeaderDetails(dispatch, currency).catch(err => {
      console.log("FOOTER API ERROR ==== " + err);
    });
    HeaderService.fetchFooterDetails(dispatch).catch(err => {
      console.log("FOOTER API ERROR ==== " + err);
    });
    HeaderService.fetchHomepageData(dispatch).catch(err => {
      console.log("Homepage API ERROR ==== " + err);
    });
    Api.getAnnouncement(dispatch).catch(err => {
      console.log("FOOTER API ERROR ==== " + err);
    });
    BasketService.fetchBasket(dispatch);
  },
  getClientIpCurrency: async function() {
    // Axios.post(`${__API_HOST__}/myapi/common/count_api_hits/`);
    const response = await new Promise((resolve, reject) => {
      fetch(`https://api.ipdata.co/?api-key=${__IP_DATA_KEY__}`, {
        method: "GET"
      })
        .then(resp => resp.json())
        .then(data => {
          if (data.currency) {
            if (data.currency.code == "INR" || data.currency.code == "GBP") {
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
  }
};
