import { Currency } from "../../typings/currency";
import { PLPProductItem } from "src/typings/product";
import { Basket } from "typings/basket";
export interface LineItems {
  id: number;
  quantity: null;
  bridalProfile: boolean | null;
  giftCardImage: string;
  product: PLPProductItem;
}
export interface CartItems {
  products: PLPProductItem[];
  totalWithOutGcItems: number;
  isBridal: boolean;
  totalExclTax: number;
  totalExclTaxExclDiscounts: number;
  bridal: boolean;
  currency: Currency;
  isTaxKnown: boolean;
  lineItems: LineItems;
  loyalityUpdated: boolean;
  offerDiscounts: [];
  shippable: boolean;
  subtotalExclusive: number;
  totalExclusive: number;
  totalTax: number;
  totalWithoutGCItems: number;
  voucherDiscounts: [];
  loyaltyUpdated: boolean;
  subTotal: string;
  total: string;
  totalWithOutGCItems: number;
}
export interface State {
  stockError: string;
  shipping: boolean;
  value: number;
  freeShipping: boolean;
  isSuspended: boolean;
  goToIndex: any;
  selectedSize: any;
  sizeError: string;
  quantity: number;
  addedToBag: boolean;
  apiTrigger: boolean;
}
