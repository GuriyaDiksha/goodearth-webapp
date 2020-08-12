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
import { Currency } from "typings/currency";
import { updateCurrency } from "actions/currency";
import { showMessage } from "actions/growlMessage";
import { INVALID_SESSION_LOGOUT } from "constants/messages";

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
  login: async function(dispatch: Dispatch, email: string, password: string) {
    const res = await API.post<loginResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/auth/login/"}`,
      {
        email: email,
        password: password
      }
    );
    CookieService.setCookie("atkn", res.token, 365);
    CookieService.setCookie("userId", res.userId, 365);
    CookieService.setCookie("email", res.email, 365);
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
      dispatch(updateCookies({ tkn: "" }));
      MetaService.updateMeta(dispatch, {});
      WishlistService.resetWishlist(dispatch);
      BasketService.fetchBasket(dispatch);
      dispatch(resetMeta(undefined));
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
  fetchCountryData: (dispatch: Dispatch) => {
    return API.get<countryDataResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/address/countries_state/"}`
    );
  }
};
