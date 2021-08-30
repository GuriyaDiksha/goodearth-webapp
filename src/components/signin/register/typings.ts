export type registerState = {
  disableButton: boolean;
  msgt: string;
  url: string;
  showerror: string;
  showFields: boolean;
  successMsg: string;
  showPassword: boolean;
  minDate: string;
  maxDate: string;
  showDOBLabel: boolean;
  passValidLength: boolean;
  passValidUpper: boolean;
  passValidLower: boolean;
  passValidNum: boolean;
  showPassRules: boolean;
};

export type RegisterProps = {
  nextStep?: () => void;
  changeEmail?: () => void;
};
