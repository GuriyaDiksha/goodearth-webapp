export type loginProps = {
  loginclick?: string;
};

export type loginState = {
  email: string | null;
  password: string | null;
  msg: string | (string | JSX.Element)[];
  msgp: string;
  highlight: boolean;
  highlightp: boolean;
  disableSelectedbox: boolean;
  showerror: string;
  socialRedirectUrl: string;
  isPasswordDisabled: boolean;
  isLoginDisabled: boolean;
  shouldFocusOnPassword: boolean;
  successMsg: string;
  showPassword: boolean;
};
