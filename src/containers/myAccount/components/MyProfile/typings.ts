export type ProfileProps = {
  setCurrentSection: () => void;
  currentCallBackComponent?: string;
};

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

export type ProfileResponse = {
  phoneCountryCode: string;
  phoneNumber: string;
  emailId: string;
  firstName: string;
  lastName: string;
  loginVia: string;
  gender: string;
  panPassportNumber: string;
  dateOfBirth: string;
  newsletter: boolean;
  subscribe: boolean;
  uniqueId: string;
  user: number;
  abandonedCartNotification: boolean;
  country: string;
  state: string;
};
export type State = {
  // data: Partial<ProfileResponse>;
  newsletter: boolean;
  uniqueId: string;
  user: number;
  abandonedCartNotification: boolean;
  updateProfile: boolean;
  subscribe: boolean;
  showerror: string;
  panHighlight: boolean;
  panmsg: string;
  dateOfBirth: string;
  code: string;
  loginVia: string;
  showDOBLabel: boolean;
  nmsg: string;
  phonecodeError: string;
  highlightCode: boolean;
  numHighlight: boolean;
  phoneNumber: string;
  minDate: string;
  maxDate: string;
  errorDob: string;
  hightlightDob: boolean;
  countryOptions: CountryOptions[];
  stateOptions: StateOptions[];
  isIndia: boolean;
};
