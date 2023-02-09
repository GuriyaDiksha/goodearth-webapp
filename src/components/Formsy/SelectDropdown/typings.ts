import { RefObject } from "react";
// import FormSelect from "./index";
export type Props = {
  name: string;
  value?: string;
  options: {
    value: string;
    label: string;
    isdCode?: string | undefined;
    states?: { value: string; label: string }[];
  }[];
  allowFilter: boolean;
  handleChange?: (event: any) => void;
  className?: string;
  selectRef?: RefObject<HTMLSelectElement>;
  label?: string;
  placeholder?: string;
  disable?: boolean;
  // ref?: RefObject<typeof FormSelect>;
  blur?: (event: React.FocusEvent) => void;
  showLabel?: boolean;
};
