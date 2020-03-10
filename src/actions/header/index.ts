import { actionCreator } from "utils/actionCreator";
import { HeaderData } from "components/header/typings";

export const updateheader = (data: HeaderData[]) =>
  actionCreator("UPDATE_HEADER", data);
