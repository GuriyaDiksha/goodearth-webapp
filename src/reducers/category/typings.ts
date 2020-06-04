import * as Actions from "actions/category";
import { ActionType } from "typings/actionCreator";

export type CategoryState = {
  shopthelook1: any;
  shopthelook2: any;
  editSection: any;
  topliving: any;
  peoplebuying: any;
  newarrival: any;
};

export type CategoryActions = ActionType<typeof Actions>;
