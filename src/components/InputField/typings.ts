export type Props = {
  value: string;
  placeholder?: string;
  className?: string;
  type?: string;
  label?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  errorMsg?: string;
  onChange: (value: string, error: string) => void;
  validator?: (
    value: string
  ) => {
    valid: boolean;
    message?: string;
  };
};

export type State = {
  labelclass: boolean;
};
