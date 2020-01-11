import { PLPProductItem } from "src/typings/product";
import { Currency } from "../../typings/currency";

export type PLPResultItemProps = {
  product: PLPProductItem;
  addedToWishlist: boolean;
  currency: Currency;
};
