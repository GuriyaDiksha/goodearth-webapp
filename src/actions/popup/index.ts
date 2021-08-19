import { PopupData } from "typings/api";
import { actionCreator } from "utils/actionCreator";

export const updatePopup = (data: PopupData[]) =>
  actionCreator("UPDATE_POPUP_DATA", data);
