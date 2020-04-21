import React from "react";
import { renderModal } from "utils/modal";
import ForgotPasswordForm from "components/signin/forgotPassword";
import LoginForm from "components/signin/Login";
import RegisterForm from "components/signin/register";

export default {
  showForgotPassword: function(event?: React.MouseEvent): void {
    renderModal(<ForgotPasswordForm />, { fullscreen: true });
  },
  showLogin: function(event?: React.MouseEvent): void {
    renderModal(<LoginForm />, { fullscreen: true });
  },
  showRegister: function(event?: React.MouseEvent): void {
    renderModal(<RegisterForm />, { fullscreen: true });
  }
};
