import { Currency } from "typings/currency";
import { User } from "typings/user";
import { PageMeta } from "typings/meta";
import { AddressData } from "components/Address/typings";

export type MetaResponse = {
  currency: Currency;
  user: User;
  bridalUser: boolean;
  bridalId: number;
  bridalCurrency: Currency;
  shippingData: AddressData | null;
  giftCard: any[];
};

export type PageMetaResponse = PageMeta;

export type PageMetaRequest = {
  page: string;
  pathName: string;
  productId?: string;
};
