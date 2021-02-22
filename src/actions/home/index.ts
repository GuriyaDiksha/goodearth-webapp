import { actionCreator } from "utils/actionCreator";
import { HomeProps } from "typings/home";
export const addHomeData = (data: HomeProps) =>
  actionCreator("ADD_HOME_DATA", data);
