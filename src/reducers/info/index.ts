import { State, InfoActions } from "./typings";

const initialState: State = {
  isSale: false
};

export const info = (state: State = initialState, action: InfoActions) => {
  switch (action.type) {
    case "UPDATE_SALE": {
      const newState = { ...state };
      newState.isSale = action.payload;
      return newState;
    }
  }

  return state;
};
