import { ProductID } from "./id";
import { BasketProduct } from "./product";

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

export type Basket = {
  shippable: boolean;
  currency: string;
  subtotalExclusive: number;
  totalExclusive: number;
  totalTax: number;
  totalWithoutGCItems: number;
  voucherDiscounts: [];
  offerDiscounts: [];
  lineItems: BasketLineItem[];
  bridal: boolean;
  loyalityUpdated: boolean;
  isTaxKnown: boolean;
};
