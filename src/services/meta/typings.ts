import { Currency } from "typings/currency";
import { User } from "typings/user";
import { PageMeta } from "typings/meta";

export type MetaResponse = {
  currency: Currency;
  user: User;
  bridalUser: boolean;
  shippingData: any[];
  giftCard: any[];
};

export type PageMetaResponse = PageMeta;

export type PageMetaRequest = {
  page: string;
  pathName: string;
  productId?: string;
};
