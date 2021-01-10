import { GrowlMessageState, GrowlMessageActions } from "./typings";

const initialState: GrowlMessageState = [];

export const growlMessage = (
  state: GrowlMessageState = initialState,
  action: GrowlMessageActions
) => {
  switch (action.type) {
    case "SHOW_MESSAGE": {
      return [...state, action.payload];
    }
    case "HIDE_MESSAGE": {
      const id = action.payload.id;
      const newState = state.filter(growl => growl.id != id);
      return newState;
    }
  }
  return state;
};
