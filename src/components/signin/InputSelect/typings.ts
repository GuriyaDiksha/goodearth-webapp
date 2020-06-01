import { RefObject } from "react";
export type Props = {
  name: string;
  value: string;
  onChange?: (event: React.ChangeEvent) => void;
  className?: string;
  disabled?: boolean;
  placeholder: string;
  errorMessage?: string;
  selectRef?: RefObject<HTMLSelectElement>;
  options: string[];
  label: string;
  required: boolean;
};
