import { ProductID } from "typings/id";
import {
  ChildProductAttributes,
  PartialChildProductAttributes
} from "typings/product";
import { PriceRecord } from "typings/price";

export type Props = {
  gtmListType?: string;
  title?: string;
  childAttributes?: ChildProductAttributes[] | PartialChildProductAttributes[];
  priceRecords?: PriceRecord;
  discountedPriceRecords?: PriceRecord;
  categories?: string[];
  id: ProductID;
  showText?: boolean;
  className?: string;
  size?: string;
  mobile?: boolean;
  iconClassName?: string;
  basketLineId?: ProductID;
  onMoveToWishlist?: () => void;
  source?: string;
  inWishlist?: boolean;
  parentWidth?: boolean;
  onComplete?: () => void;
  isPlpTile?: boolean;
  tablet?: boolean;
  badgeType?: string;
  createWishlistPopup?: any;
  isPdp?: boolean;
  closeModal?: any;
  toggleBag?: any;
};
