import * as Actions from "actions/filler";
import { Product, PartialProductItem, PLPProductItem } from "typings/product";
import { ActionType } from "typings/actionCreator";

export type State = {
  data: Product | PartialProductItem | PLPProductItem;
  show: boolean;
};

export { Actions };

export type FillerActions = ActionType<typeof Actions>;
