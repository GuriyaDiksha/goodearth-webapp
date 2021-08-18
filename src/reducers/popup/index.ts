import { PopupData } from "typings/api";
import { PopupAction } from "./typings";

const initialState: PopupData = [];
export const popup = (state = initialState, action: PopupAction) => {
  switch (action.type) {
    case "UPDATE_POPUP_DATA": {
      const newState = action.payload;
      return newState;
    }
  }
  return state;
};
