import React from "react";
import { Dispatch } from "redux";
import ForgotPasswordForm from "components/signin/forgotPassword";
import LoginForm from "components/signin/Login";
import RegisterForm from "components/signin/register";
import API from "utils/api";
import {
  logoutResponse,
  checkUserPasswordResponse,
  resetPasswordResponse,
  loginResponse,
  registerResponse,
  countryDataResponse
} from "./typings";
// import initAction from "../../client/initAction";
import { updateCookies } from "actions/cookies";
import { updateComponent, updateModal } from "../../actions/modal";
import CookieService from "services/cookie";

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
      "http://api.goodearth.in/myapi/auth/check_user_password/",
      {
        email: email
      }
    );
    return res;
  },
  resetPassword: async function(dispatch: Dispatch, formData: FormData) {
    const res = await API.post<resetPasswordResponse>(
      dispatch,
      "http://api.goodearth.in/myapi/auth/reset_password/",
      formData
    );
    return res;
  },
  login: async function(dispatch: Dispatch, email: string, password: string) {
    const res = await API.post<loginResponse>(
      dispatch,
      "http://api.goodearth.in/myapi/auth/login/",
      {
        email: email,
        password: password
      }
    );
    document.cookie =
      "atkn=" + res.token + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    document.cookie =
      "user_id=" +
      res.userId +
      "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    document.cookie =
      "email=" + res.email + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    const cookies = CookieService.parseCookies(document.cookie);
    dispatch(updateCookies(cookies));
    // initAction(store);
    return res;
  },
  logout: async function(dispatch: Dispatch) {
    const res = await API.post<logoutResponse>(
      dispatch,
      "http://api.goodearth.in/myapi/auth/logout/",
      {}
    );
    if (res) {
      document.cookie = "atkn=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
      document.cookie =
        "bridal_id=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
      document.cookie =
        "bridal_currency=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
      document.cookie =
        "user_id=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
      document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
      const cookies = CookieService.parseCookies(document.cookie);
      dispatch(updateCookies(cookies));
      // initAction(store);
      return res;
    }
  },
  register: async function(dispatch: Dispatch, formData: FormData) {
    const res = await API.post<registerResponse>(
      dispatch,
      "http://api.goodearth.in/myapi/auth/register/",
      formData
    );
    document.cookie =
      "atkn=" + res.token + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    document.cookie =
      "user_id=" +
      res.userId +
      "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    document.cookie =
      "email=" + res.email + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    const cookies = CookieService.parseCookies(document.cookie);
    dispatch(updateCookies(cookies));
    // initAction(store);
    return res;
  },
  fetchCountryData: (dispatch: Dispatch) => {
    return API.get<countryDataResponse>(
      dispatch,
      "http://api.goodearth.in/myapi/address/countries_state"
    );
  }
};
