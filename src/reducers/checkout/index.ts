import { State, GiftActions } from "./typings";

const initialState: State = {
  giftcardData: []
};

export const checkout = (state = initialState, action: GiftActions): State => {
  switch (action.type) {
    case "GET_GIFTCARD": {
      return {
        ...state,
        ...action.payload
      };
    }
  }
};
