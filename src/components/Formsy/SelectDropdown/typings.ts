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
  inputRef: RefObject<HTMLInputElement>;
  label?: string;
  placeholder?: string;
  disable?: boolean;
  // ref?: RefObject<typeof FormSelect>;
  blur?: (event: React.FocusEvent) => void;
  showLabel?: boolean;
  optionsClass?: string;
  searchContainerClass?: string;
  searchInputClass?: string;
  searchIconClass?: string;
};
