// import { ModalContext } from "components/Modal/typings.ts";
export type ForgotPasswordProps = {
  // closePopup: () => void;
  showRegister: () => void;
};

export type ForgotPasswordState = {
  err: boolean;
  msg: string;
  forgotSuccess: boolean;
  successMsg: string;
  url: string;
  disableSelectedbox: boolean;
};
