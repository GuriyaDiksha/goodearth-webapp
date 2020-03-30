import { State, CookiesActions } from "./typings";

const initialState: State = {};

export const cookies = (
  state = initialState,
  action: CookiesActions
): State => {
  switch (action.type) {
    case "UPDATE_COOKIE": {
      return { ...state, ...action.payload };
    }
  }

  return state;
};
