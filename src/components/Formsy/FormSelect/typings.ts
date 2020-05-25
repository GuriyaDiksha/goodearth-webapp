import { RefObject } from "react";
export type Props = {
  name: string;
  value?: string;
  options: { value: string; label: string }[];
  handleChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  selectRef?: RefObject<HTMLSelectElement>;
  label?: string;
  placeholder?: string;
  disable?: boolean;
  blur?: (event: React.FocusEvent) => void;
};
