import { State, ModalActions } from "./typings";
// import * as Actions from "actions/quickview";

const initialState: State = {
  component: null,
  openModal: false,
  fullscreen: false,
  bodyClass: ""
};

export const modal = (state = initialState, action: ModalActions): State => {
  switch (action.type) {
    case "UPDATE_COMPONENT": {
      return {
        ...state,
        component: action.payload.component,
        fullscreen: action.payload.fullscreen,
        bodyClass: action.payload.bodyClass || ""
      };
    }
    case "UPDATE_MODAL": {
      const newState = { ...state };
      newState.openModal = action.payload;
      return newState;
    }
  }

  return state;
};
