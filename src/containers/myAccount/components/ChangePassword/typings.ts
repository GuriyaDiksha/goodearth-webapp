export type PasswordProps = {
  setCurrentSection: () => void;
};
export type State = {
  showerror: string;
  updatePassword: boolean;
  passValidLength: boolean;
  passValidUpper: boolean;
  passValidLower: boolean;
  passValidNum: boolean;
  showPassRules: boolean;
  shouldValidatePass: boolean;
  showPassword: boolean;
};
