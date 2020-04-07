import { actionCreator } from "utils/actionCreator";
import { ProductID } from "typings/id";

export const updateQuickviewId = (id: ProductID) =>
  actionCreator("UPDATE_Id", id);
