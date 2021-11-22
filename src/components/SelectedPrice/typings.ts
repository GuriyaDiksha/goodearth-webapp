import { Currency } from "typings/currency";

export interface Props {
  price: string | number;
  discountPrice: string | number;
  discount: boolean;
  isSale: boolean;
  code: any;
  currency: Currency;
  badgeType?: string;
}
