import { Currency } from "typings/currency";
import { User } from "typings/user";

export type MetaResponse = {
  currency: Currency;
  user: User;
  bridalUser: boolean;
  shippingData: any[];
  giftCard: any[];
};
