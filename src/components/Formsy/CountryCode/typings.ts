import { countryDataResponse } from "services/login/typings";

export type Props = {
  fetchCountryData: () => Promise<countryDataResponse>;
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
