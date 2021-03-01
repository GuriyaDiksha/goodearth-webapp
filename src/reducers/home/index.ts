import { HomeState, HomeActions } from "./typings";

const initialState: HomeState = {
  section1: {},
  section2: {},
  section3: {}
};

export const home = (state: HomeState = initialState, action: HomeActions) => {
  switch (action.type) {
    case "ADD_HOME_DATA": {
      const newState = { ...state };
      newState.section1 = action.payload.section1 || {};
      newState.section2 = action.payload.section2 || {};
      newState.section3 = action.payload.section3 || {};
      {
        return { ...newState };
      }
    }
  }
  return state;
};
