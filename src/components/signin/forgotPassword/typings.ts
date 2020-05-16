export type ForgotPasswordProps = {};

export type ForgotPasswordState = {
  email: string | null;
  err: boolean;
  msg: string;
  forgotSuccess: boolean;
  successMsg: string;
  url: string;
  disableSelectedbox: boolean;
};
