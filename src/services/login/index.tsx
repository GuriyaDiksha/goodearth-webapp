import React from "react";
import { renderModal } from "utils/modal";
import ForgotPasswordForm from "components/signin/forgotPassword";
import LoginForm from "components/signin/Login";

export default {
  showForgotPassword: function(event: React.MouseEvent): void {
    renderModal(
      <ForgotPasswordForm
        showRegister={() => {
          alert("show register form");
        }}
      />,
      { fullscreen: true }
    );
  },
  showLogin: function(event: React.MouseEvent): void {
    renderModal(<LoginForm loginclick="" />, { fullscreen: true });
  }
};
