import { State, GiftActions } from "./typings";

const initialState: State = {
  data: []
};

export const basket = (state = initialState, action: GiftActions): State => {
  switch (action.type) {
    case "GET_GIFTCARD": {
      return {
        ...state,
        ...action.payload
      };
    }
  }

  return state;
};
