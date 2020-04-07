import { State, ModalActions } from "./typings";
// import * as Actions from "actions/quickview";

const initialState: State = {
  component: null,
  openModal: false
};

export const modal = (state = initialState, action: ModalActions): State => {
  switch (action.type) {
    case "UPDATE_COMPONENT": {
      const newState = { ...state };
      newState.component = action.payload;
      return newState;
    }
    case "UPDATE_MODAL": {
      const newState = { ...state };
      newState.openModal = action.payload;
      return newState;
    }
  }

  return state;
};
