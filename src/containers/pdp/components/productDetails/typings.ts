import { Product } from "typings/product";
import { Currency } from "typings/currency";
import { ProductID } from "typings/id";

export type Props = {
  data: Product;
  currency: Currency;
  mobile: boolean;
  wishlist: ProductID[];
};
