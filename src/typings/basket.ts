import { ProductID } from "./id";
import { BasketProduct, PLPProductItem } from "./product";
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
  bridalProfile: boolean;
  giftCardImage: string;
  quantity: number;
  product: BasketProduct;
};

export type Points = {
  points: number | string;
};

export type Basket = {
  shippable: boolean;
  subtotalExclusive: number;
  totalExclusive: number;
  totalTax: number;
  totalWithoutGCItems: number;
  voucherDiscounts: any[];
  offerDiscounts: any[];
  lineItems: BasketLineItem[];
  // bridal: boolean;
  loyalityUpdated: boolean;
  isTaxKnown: boolean;
  products?: PLPProductItem[];
  totalWithOutGcItems?: number;
  isBridal: boolean;
  totalExclTax?: number;
  totalExclTaxExclDiscounts?: number;
  currency: Currency;
  // lineItems: LineItems;
  loyaltyUpdated?: boolean;
  // subTotal?: string;
  // total?: string;
  totalWithOutGCItems?: number;
  shippingCharge: string | number;
  total: string | number;
  subTotal: string | number;
  giftCards: BalanceProps[];
  loyalty: Points[];
};

export interface BasketItem extends BasketLineItem {
  currency: Currency;
  saleStatus?: boolean;
}
