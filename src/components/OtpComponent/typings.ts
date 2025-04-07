export type otpState = {
  msgt: string;
  showFields: boolean;
  radioType: string;
  subscribeError: string;
  otpTimer: number;
  otpData: any;
  updateStatus: boolean;
  showerror: string;
  showerrorOtp: string;
  otp: string;
  toggleOtp: boolean;
  isLoading: boolean;
  isResendOtpDisabled?: boolean;
  otpLimitError?: boolean;
  phoneInput?: string;
  emailInput?: string;
  attempts: {
    attempts: number;
    maxAttemptsAllow: number;
  };
  startTimer: boolean;
  isOtpSent?: boolean;
  disable?: boolean;
  isDisabled?: boolean;
  attempt_count: number;
  selectedOption?: any;
  activatedPhoneNo?: string;
};

export type otpProps = {
  toggleReset?: boolean;
  txtvalue: string;
  sendOtp: (data: any) => any;
  toggleOtp: (data: boolean) => void;
  checkOtpBalance: (data: any) => any;
  activateGiftCard?: (data: any) => Promise<any>;
  updateList: (data: any) => void;
  isCredit?: boolean;
  updateError: (message: string) => void;
  validateEmptyInputs?: () => void;
  otpFor?: "activateGC" | "balanceGC" | "balanceCN";
  firstName?: string;
  lastName?: string;
  newCardBox?: boolean;
  email?: string;
  code?: string;
  phoneNo?: string;
  disableSendOtpButton: boolean;
  isIndiaGC?: boolean;
  newGiftCard?: () => void;
  isFromCheckBalance?: boolean;
  mobile: boolean;
  countryCode?: string;
  isLoggedIn?: boolean;
  activatedGcMsg?: string;
};

export type otpRedeemProps = {
  sendOtp: (data: any) => any;
  resendOtp: (points: number | string) => any;
  toggleOtp: (data: boolean) => void;
  checkOtpRedeem: (
    data: any,
    history: any,
    isLoggedIn: boolean
  ) => Promise<any>;
  updateList: (data: any) => void;
  isCredit?: boolean;
  updateError: (data: boolean) => void;
  validateEmptyInputs?: () => void;
  otpFor?: "activateGC" | "balanceGC" | "balanceCN";
  firstName?: string;
  lastName?: string;
  newCardBox?: boolean;
  email?: string;
  CustomerPointInformation: any;
  points: number | string;
  number?: string;
  isLoggedIn: boolean;
  history: any;
  validated: boolean;
  disableBtn: string;
  removeRedeem: () => void;
  setIsactiveredeem: (val: boolean) => void;
  isOTPSent: boolean;
  setIsOTPSent: (val: boolean) => void;
  closeModal: () => any;
  removeError: () => any;
  mobile?: boolean;
  countryCode?: string;
};

export type otpBoxProps = {
  otpValue: (data: string) => void;
  notFocus?: boolean;
  placeholder?: string;
  error?: boolean;
};
