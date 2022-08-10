import { State, ModalActions } from "./typings";
// import * as Actions from "actions/quickview";

const initialState: State = {
  component: "",
  props: null,
  openModal: false,
  fullscreen: false,
  bodyClass: "",
  classname: ""
};

export const modal = (state = initialState, action: ModalActions): State => {
  switch (action.type) {
    case "UPDATE_COMPONENT": {
      return {
        ...state,
        component: action.payload.component,
        props: action.payload.props,
        fullscreen: action.payload.fullscreen,
        bodyClass: action.payload.bodyClass || "",
        classname: action.payload.classname || ""
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
