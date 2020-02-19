import * as Actions from "actions/product";
import { Product, PartialProductItem, PLPProductItem } from "typings/product";
import { ActionType } from "typings/actionCreator";
import { ProductID } from "typings/id";

export type State = {
  [x: number]: Product<ProductID> | PartialProductItem | PLPProductItem;
};

export { Actions };

export type ProductActions = ActionType<typeof Actions>;
