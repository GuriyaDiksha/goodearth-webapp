import { User } from "src/typings/user";
import {
  Product,
  PartialProductItem,
  PLPProductItem
} from "src/typings/product";
import { Currency } from "src/typings/currency";

export type AppState = {
  user: User | {};
  currency: Currency;
  products: {
    [x: number]: Product | PartialProductItem | PLPProductItem;
  };
};
