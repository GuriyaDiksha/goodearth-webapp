import { Currency } from "../../typings/currency";
import { PLPProductItem } from "src/typings/product";

export interface CartItems {
  products: PLPProductItem[];
  totalWithOutGcItems: number;
  isBridal: boolean;
  totalExclTax: number;
  totalExclTaxExclDiscounts: number;
}
export type CartProps = {
  cart: CartItems;
  currency: Currency;
  active: boolean;
  toggleBag: () => void;
};

export interface State {
  stockError: string;
  shipping: boolean;
}
