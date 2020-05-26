import { actionCreator } from "utils/actionCreator";
import { CategoryProps } from "typings/category";
export const addCategoryData = (data: CategoryProps) =>
  actionCreator("ADD_CATEGORY_DATA", data);
