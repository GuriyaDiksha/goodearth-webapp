import { Currency } from "typings/currency";
import { Basket } from "typings/basket";

export type LoginProps = {
  isActive: boolean;
  user: any;
};

export type AddressProps = {
  isActive: boolean;
  user: any;
};

export type OrderProps = {
  mobile: boolean;
  currency: Currency;
  basket: Basket;
  page: string;
  shippingAddress: any;
  salestatus: boolean;
  validbo: boolean;
};
