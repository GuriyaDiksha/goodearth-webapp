import { State, BridalActions } from "./typings";

const initialState: State = {
  count: 0
};

export const bridal = (state = initialState, action: BridalActions): State => {
  switch (action.type) {
    case "COUNT_BRIDAL": {
      return {
        ...state,
        ...action.payload
      };
    }
  }

  return state;
};
