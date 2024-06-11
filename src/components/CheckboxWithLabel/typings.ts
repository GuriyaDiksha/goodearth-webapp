import { RefObject } from "react";

export type CheckboxProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  inputRef?: RefObject<HTMLInputElement>;
  id: string;
  name?: string;
  checked?: boolean;
  inputClassName?: string;
  label: JSX.Element[];
  value?: string;
  itemCount?: number;
};
