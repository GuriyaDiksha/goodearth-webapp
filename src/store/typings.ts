import { User } from "src/typings/user";
import {
  Product,
  PartialProductItem,
  PLPProductItem
} from "src/typings/product";

export type AppState = {
  user: User | {};
  currency: "USD" | "INR";
  products: {
    [x: number]: Product | PartialProductItem | PLPProductItem;
  };
};
