import React from "react";
import loadable from "@loadable/component";
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
import { Currency } from "typings/currency";
import { updateCurrency } from "actions/currency";
import { showMessage } from "actions/growlMessage";
import {
  INVALID_SESSION_LOGOUT,
  LOGOUT_SUCCESS,
  LOGIN_SUCCESS
} from "constants/messages";

const LoginForm = loadable(() => import("components/signin/Login"));
const RegisterForm = loadable(() => import("components/signin/register"));
const ForgotPasswordForm = loadable(() =>
  import("components/signin/forgotPassword")
);

export default {
  showForgotPassword: function(
    dispatch: Dispatch,
    event?: React.MouseEvent
  ): void {
    dispatch(updateComponent(<ForgotPasswordForm />, true));
    dispatch(updateModal(true));
  },
  showLogin: function(dispatch: Dispatch, event?: React.MouseEvent): void {
    dispatch(updateComponent(<LoginForm />, true));
    dispatch(updateModal(true));
  },
  showRegister: function(dispatch: Dispatch, event?: React.MouseEvent): void {
    dispatch(updateComponent(<RegisterForm />, true));
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
    dispatch(showMessage(`${res.firstName}, ${LOGIN_SUCCESS}`, 5000));
    dispatch(updateCookies({ tkn: res.token }));
    dispatch(updateUser({ isLoggedIn: true }));
    MetaService.updateMeta(dispatch, { tkn: res.token });
    WishlistService.updateWishlist(dispatch);
    BasketService.fetchBasket(dispatch, source);
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
    dispatch(showMessage(`${res.firstName}, ${LOGIN_SUCCESS}`, 5000));
    dispatch(updateCookies({ tkn: res.token }));
    dispatch(updateUser({ isLoggedIn: true }));
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
      CookieService.setCookie("currency", "INR", 365);
      dispatch(updateCurrency("INR"));
      dispatch(updateCookies({ tkn: "" }));
      MetaService.updateMeta(dispatch, {});
      WishlistService.resetWishlist(dispatch);
      BasketService.fetchBasket(dispatch);
      dispatch(resetMeta(undefined));
      dispatch(showMessage(LOGOUT_SUCCESS, 5000));
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
    dispatch(showMessage(INVALID_SESSION_LOGOUT, 5000));
  },
  register: async function(dispatch: Dispatch, formData: FormData) {
    const res = await API.post<registerResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/auth/register/"}`,
      formData
    );
    CookieService.setCookie("atkn", res.token, 365);
    CookieService.setCookie("userId", res.userId, 365);
    CookieService.setCookie("email", res.email, 365);
    dispatch(showMessage(`${res.firstName}, ${LOGIN_SUCCESS}`, 5000));
    dispatch(updateCookies({ tkn: res.token }));
    dispatch(updateUser({ isLoggedIn: true }));
    MetaService.updateMeta(dispatch, { tkn: res.token });
    WishlistService.updateWishlist(dispatch);
    BasketService.fetchBasket(dispatch);
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
  getClientIpCurrency: async function() {
    const response = await new Promise((resolve, reject) => {
      fetch(
        `https://api.ipdata.co/?api-key=f2c8da4302aa2d9667f6e6108ec175b88b01ff050522b335b9b2006e`,
        { method: "GET" }
      )
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
    const countryData = CacheService.get("countryData") as countryDataResponse;
    if (countryData && countryData.length > 0) {
      return countryData;
    }
    const res = await API.get<countryDataResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/address/countries_state/"}`
    );
    CacheService.set("countryData", res);
    return res;
  }
};
