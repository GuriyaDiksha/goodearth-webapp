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
  toggelOtp: boolean;
  showError: string;
};

export type otpProps = {
  txtvalue: string;
  sendOtp: (data: any) => any;
  toggelOtp: (data: boolean) => void;
  checkOtpBalance: (data: any) => any;
  gcBalanceOtp: (data: any) => void;
  isCredit?: boolean;
  updateError: (data: boolean) => void;
};

export type otpBoxProps = {
  otpValue: (data: string) => void;
};
