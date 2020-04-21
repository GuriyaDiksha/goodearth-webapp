export type Props = {
  name?: string;
  type?: string;
  value?: string;
  label?: string;
  error?: string;
  placeholder: string;
  border?: boolean;
  disable?: boolean;
  className?: string;
  id?: string;
  blur?: (event: React.FocusEvent) => void;
  isDrop?: boolean;
  isPaste?: boolean;
  inputClass?: string;
  disablePassword?: () => void;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  keyPress?: (event: React.KeyboardEvent) => void;
  keyUp?: (event: React.KeyboardEvent) => void;
  min?: number | string;
  max?: number | string;
  inputRef?: string;
  isPlaceholderVisible?: boolean;
};

export type State = {
  value: string;
  labelClass: boolean;
  placeholder: string;
};
