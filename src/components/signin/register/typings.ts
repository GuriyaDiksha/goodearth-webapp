type CountryOptions = {
  value: string;
  label: string;
  code2: string;
  isd: string | undefined;
  states: StateOptions[];
};

type StateOptions = {
  value: string;
  label: string;
  id: number;
  nameAscii: string;
};

export type registerState = {
  disableButton: boolean;
  msgt: string;
  url: string;
  showerror: string;
  showFields: boolean;
  successMsg: string;
  showPassword: boolean;
  minDate: any;
  maxDate: any;
  showDOBLabel: boolean;
  passValidLength: boolean;
  passValidUpper: boolean;
  passValidLower: boolean;
  passValidNum: boolean;
  showPassRules: boolean;
  shouldValidatePass: boolean;
  countryOptions: CountryOptions[];
  stateOptions: StateOptions[];
  isIndia: boolean;
  showEmailVerification: boolean;
  email: string;
  showTip?: boolean;
  whatsappChecked?: boolean;
  selectedCountry?: string;
  phoneNo?: string;
  countryCodeErr?: string;
  newsLetterChecked: boolean;
  selectedDate?: any;
  validationErrors?: {
    isValidDate?: string;
    isMinAllowedDate?: string;
    isMaxAllowedDate?: string;
  };
};

export type RegisterProps = {
  nextStep?: () => void;
  changeEmail?: () => void;
  goToLogin: () => void;
  isCheckout?: boolean;
  setIsSuccessMsg?: (arg: boolean) => void;
  email: string;
};
