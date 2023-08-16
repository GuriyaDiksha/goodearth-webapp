// import { countryDataResponse } from "services/login/typings";

export type Props = {
  code?: string;
  error?: string;
  blur?: () => void;
  border?: boolean;
  id: string;
  className?: string;
  label?: string;
  disable?: boolean;
  placeholder: string;
  value: string;
  handleChange?: (event: React.ChangeEvent, newValue?: string) => void;
  showLabel?: boolean;
  innerRef?: any;
  name: string;
  autocomplete?: string;
  hideArrow?: boolean;
};

export type Country = {
  id: number;
  nameAscii: string;
  code2: string;
  regionSet: [
    {
      id: number;
      nameAscii: string;
    }
  ];
  isdCode?: string;
};

export type AddressMode = "new" | "edit" | "list";
