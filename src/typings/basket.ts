import { ProductID } from "./id";
import {
  BasketProduct,
  ChildProductAttributes,
  PLPProductItem
} from "./product";
import { Currency } from "./currency";
import { BalanceProps } from "containers/checkout/component/typings";
// import { LineItems } from "components/Bag/typings";

export type BasketStockRecord = {
  partnerSKU: string;
  productId: ProductID;
  numInStock: number;
  numAllocated: number;
  partner: number;
};

export type BasketLineItem = {
  id: number;
  childAttributes: ChildProductAttributes[];
  bridalProfile: number;
  giftCardImage: string;
  quantity: number;
  product: BasketProduct;
  GCValue: number;
};

export type Points = {
  points: number | string;
  isValidated: boolean;
};

export type Basket = {
  finalDeliveryDate: string;
  shippable: boolean;
  subtotalExclusive: number;
  totalExclusive: number;
  totalTax: number;
  totalWithoutGCItems: number;
  voucherDiscounts: any[];
  offerDiscounts: any[];
  lineItems: BasketLineItem[];
  loyalityUpdated: boolean;
  isTaxKnown: boolean;
  products?: PLPProductItem[];
  totalWithOutGcItems?: number;
  // isBridal: boolean;
  totalExclTax?: number;
  totalExclTaxExclDiscounts?: number;
  currency: Currency;
  loyaltyUpdated?: boolean;
  totalWithOutGCItems?: number;
  shippingCharge: number;
  total: number;
  subTotal: string | number;
  subTotalWithShipping: string | number;
  giftCards: BalanceProps[];
  loyalty: Points[];
  redirectToCart: string;
  isOnlyGiftCart: boolean;
  publishRemove: boolean;
  updated: boolean;
  addnewGiftcard: string | number;
  bridal: boolean;
  bridalProfileId?: number;
  bridalAddressId?: number;
  freeShippingThreshold: number;
  freeShippingApplicable: number;
  updatedRemovedItems: string[];
  unshippableRemove?: boolean;
  unshippableProducts?: string[];
  store?: any[];
  redirectHomepage?: boolean;
  pageReload?: boolean;
  amountPayable?: number;
  totalWithoutShipping?: number;
};

export type GCMetaType = {
  recipeint_name: string;
  recipient_email: string;
  sender_name: string;
};

export interface BasketItem extends BasketLineItem {
  currency: Currency;
  saleStatus?: boolean;
  toggleBag?: () => void;
  onMoveToWishlist?: () => void;
  mobile?: boolean;
  onNotifyCart?: (productId: ProductID) => void;
  tablet?: boolean;
  GCMeta?: GCMetaType;
}
