import * as Actions from "actions/product";
import { Product, PartialProductItem, PLPProductItem } from "typings/product";
import { ActionType } from "typings/actionCreator";

export type State = {
  [x: number]: Product | PartialProductItem | PLPProductItem;
};

export { Actions };

export type ProductActions = ActionType<typeof Actions>;
