export type loginProps = {
  loginclick?: string;
  showRegister?: () => void;
  nextStep?: () => void;
  isBo?: string;
  heading2?: string;
  isCerise: boolean;
  heading?: string;
  subHeading?: string;
  source?: string;
};

export type loginState = {
  heading: string;
  subHeading: string;
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
  showCurrentSection?: string;
  isSecondStepLoginDisabled: boolean;
  showEmailVerification: boolean;
  usrWithNoOrder: boolean;
};
