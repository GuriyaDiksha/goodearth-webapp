import { Currency } from "typings/currency";

export type Section1Props = {
  giftimages: string[];
  next: (data: any, section: string) => void;
  data: any;
};

export type Section2Props = {
  countryData: any;
  productData: any;
  mobile: boolean;
  data: any;
  currency: Currency;
  next: (data: any, section: string) => void;
  goback: (section: string) => void;
};

export type Section3Props = {
  mobile: boolean;
  currency: Currency;
  data: any;
  next: (data: any, section: string) => void;
  goback: (section: string) => void;
};

export type Section4Props = {
  data: any;
  currency: Currency;
  mobile: boolean;
  next: (data: any, section: string) => void;
  goback: (section: string) => void;
};
