import { ProductID } from "typings/id";
import {
  ChildProductAttributes,
  PartialChildProductAttributes
} from "typings/product";
import { PriceRecord } from "typings/price";

export type Props = {
  title?: string;
  childAttributes?: ChildProductAttributes[] | PartialChildProductAttributes[];
  priceRecords?: PriceRecord;
  categories?: string[];
  id: ProductID;
  showText?: boolean;
  className?: string;
  size?: string;
  mobile?: boolean;
  iconClassName?: string;
  basketLineId?: ProductID;
  onMoveToWishlist?: () => void;
};
