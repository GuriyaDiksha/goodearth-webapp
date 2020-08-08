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
  genderOptions: { value: string; label: string }[];
};

export type RegisterProps = {
  nextStep?: () => void;
  changeEmail?: () => void;
};
