import { Currency } from "typings/currency";
import { PLPProductItem } from "typings/product";
export interface Props {
  product: PLPProductItem;
  isSale: boolean;
  code: any;
  currency: Currency;
}
