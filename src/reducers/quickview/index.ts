import { State, QuickviewtActions } from "./typings";
// import * as Actions from "actions/quickview";

const initialState: State = {
  quickviewId: 0
};

export const quickview = (
  state = initialState,
  action: QuickviewtActions
): State => {
  switch (action.type) {
    case "UPDATE_Id": {
      const newState = { ...state };
      newState.quickviewId = action.payload;
      return newState;
    }
  }

  return state;
};
