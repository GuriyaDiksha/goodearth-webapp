import { State, CurrencyActions } from "./typings";

const initialState: State = "INR";

export const currency = (
  state: State = initialState,
  action: CurrencyActions
) => {
  switch (action.type) {
    case "UPDATE_CURRENCY": {
      return action.payload;
    }
  }

  return state;
};
