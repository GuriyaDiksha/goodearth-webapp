import { ProductID } from "typings/id";
import { PLPProductItem } from "typings/product";

export type Props = {
  product: PLPProductItem;
  id: ProductID;
  showText?: boolean;
  className?: string;
  size?: string;
  mobile?: boolean;
  iconClassName?: string;
  basketLineId?: ProductID;
  onMoveToWishlist?: () => void;
};
