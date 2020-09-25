import { PLPProductItem } from "src/typings/product";
import { Currency } from "../../typings/currency";

export type PLPResultItemProps = {
  product: PLPProductItem;
  addedToWishlist: boolean;
  currency: Currency;
  mobile: boolean;
  isVisible?: boolean;
  isCollection?: boolean;
  isCorporate?: boolean;
  inStock?: boolean;
  onClickQuickView?: (id: number) => void;
};
