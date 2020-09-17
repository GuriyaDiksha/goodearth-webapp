export type ForgotPasswordProps = {};

export type ForgotPasswordState = {
  email: string | null;
  err: boolean;
  msg: string | (string | JSX.Element)[];
  forgotSuccess: boolean;
  successMsg: string;
  url: string;
  disableSelectedbox: boolean;
};
