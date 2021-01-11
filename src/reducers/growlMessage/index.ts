import { GrowlMessageState, GrowlMessageActions } from "./typings";

const initialState: GrowlMessageState = [];

export const growlMessage = (
  state: GrowlMessageState = initialState,
  action: GrowlMessageActions
) => {
  switch (action.type) {
    case "SHOW_MESSAGE": {
      let isExistingMessage = false;
      const newState = state.map(message => {
        if (message.id == action.payload.id) {
          isExistingMessage = true;
          return {
            ...message,
            text: action.payload.text,
            timeout: action.payload.timeout
          };
        } else {
          return message;
        }
      });
      if (isExistingMessage) {
        return newState;
      } else {
        return [...state, action.payload];
      }
    }
    case "HIDE_MESSAGE": {
      const id = action.payload.id;
      const newState = state.filter(growl => growl.id != id);
      return newState;
    }
  }
  return state;
};
