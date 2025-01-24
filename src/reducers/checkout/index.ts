import { State, GiftActions } from "./typings";

const initialState: State = {
  giftcardData: [],
  GCCNData: {
    hasGC: false,
    availableGCamount: "",
    availableCNamount: ""
  }
};

export const checkout = (state = initialState, action: GiftActions): State => {
  switch (action.type) {
    case "GET_GIFTCARD": {
      return {
        ...state,
        ...action.payload
      };
    }
    case "UPDATE_GCCNAMOUNT": {
      return {
        ...state,
        GCCNData: action.payload
      };
    }
    default:
      return state;
  }
};
