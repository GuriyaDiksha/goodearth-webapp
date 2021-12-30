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
  minDate: string;
  maxDate: string;
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
};

export type RegisterProps = {
  nextStep?: () => void;
  changeEmail?: () => void;
};
