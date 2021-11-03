export type otpState = {
  disable: boolean;
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
  phoneNo?: string;
  disableSendOtpButton: boolean;
  isIndiaGC?: boolean;
  newGiftCard?: () => void;
};

export type otpRedeemProps = {
  sendOtp: (data: any) => any;
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
  loyaltyData: any;
  points: number | string;
  number?: string;
  isLoggedIn: boolean;
  history: any;
};

export type otpBoxProps = {
  otpValue: (data: string) => void;
  notFocus?: boolean;
};
