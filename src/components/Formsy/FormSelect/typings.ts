import { RefObject } from "react";
// import FormSelect from "./index";
export type Props = {
  name: string;
  value?: string;
  currencyCharCode?: number[];
  countryData?: Record<string, string>;
  options: {
    value: string;
    label: string;
    isdCode?: string | undefined;
    states?: { value: string; label: string }[];
  }[];
  handleChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  selectRef?: RefObject<HTMLSelectElement>;
  label?: string;
  placeholder?: string;
  disable?: boolean;
  // ref?: RefObject<typeof FormSelect>;
  blur?: (event: React.FocusEvent) => void;
  showLabel?: boolean;
  errWithIsPristine?: boolean;
};
