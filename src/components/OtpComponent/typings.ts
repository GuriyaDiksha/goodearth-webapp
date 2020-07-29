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
  showError: string;
};

export type otpProps = {
  txtvalue: string;
  sendOtp: (data: any) => any;
  toggleOtp: (data: boolean) => void;
  checkOtpBalance: (data: any) => any;
  activateGiftCard?: (data: any) => Promise<any>;
  updateList: (data: any) => void;
  isCredit?: boolean;
  updateError: (data: boolean) => void;
  validateEmptyInputs?: () => void;
  otpFor?: "activateGC" | "balanceGC" | "balanceCN";
  firstName?: string;
  lastName?: string;
  newCardBox?: boolean;
  email?: string;
};

export type otpBoxProps = {
  otpValue: (data: string) => void;
};
