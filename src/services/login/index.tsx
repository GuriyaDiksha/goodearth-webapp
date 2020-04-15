import React from "react";
import { renderModal } from "utils/modal";
import ForgotPasswordForm from "components/signin/forgotPassword/ForgotPasswordForm";

export default {
  showLogin: function(event: React.MouseEvent): void {
    renderModal(
      <ForgotPasswordForm
        showRegister={() => {
          alert("show register form");
        }}
      />,
      { fullscreen: true }
    );
  }
};
