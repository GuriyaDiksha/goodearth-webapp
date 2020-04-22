import React from "react";
import { renderModal } from "utils/modal";
import ForgotPasswordForm from "components/signin/forgotPassword";
import LoginForm from "components/signin/Login";
import RegisterForm from "components/signin/register";

import Axios from "axios";
// import { checkuserpasswordResponse } from "./typings";

export default {
  showForgotPassword: function(event?: React.MouseEvent): void {
    renderModal(<ForgotPasswordForm />, { fullscreen: true });
  },
  showLogin: function(event?: React.MouseEvent): void {
    renderModal(<LoginForm />, { fullscreen: true });
  },
  showRegister: function(event?: React.MouseEvent): void {
    renderModal(<RegisterForm />, { fullscreen: true });
  },
  checkuserpassword: async function(email: string) {
    const res = await Axios.post(
      "http://api.goodearth.in/myapi/auth/check_user_password/",
      {
        email: email
      }
    );
    return res.data;
  },
  login: async function(email: string, password: string) {
    const res = await Axios.post("http://api.goodearth.in/myapi/auth/login/", {
      email: email,
      password: password
    });
    document.cookie =
      "tkn=" +
      res.data.token +
      "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    document.cookie =
      "user_id=" +
      res.data.user_id +
      "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    document.cookie =
      "email=" +
      res.data.email +
      "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    // document.cookie = "bridal_id=" + res.data.bridal_id + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    // document.cookie = "bridal_currency=" + res.data.bridal_currency + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    return res.data;
  }
};
