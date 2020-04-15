import { GrowlMessageState, GrowlMessageActions } from "./typings";

const initialState: GrowlMessageState = {
  text: ""
};

export const growlMessage = (
  state: GrowlMessageState = initialState,
  action: GrowlMessageActions
) => {
  switch (action.type) {
    case "SHOW_MESSAGE": {
      return {
        ...state,
        ...action.payload
      };
    }
    case "HIDE_MESSAGE": {
      return {
        ...state,
        text: "",
        timeout: undefined
      };
    }
  }
  return state;
};
