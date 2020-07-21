import { State, UserActions } from "./typings";

export const initialState: State = {
  firstName: "",
  lastName: "",
  email: "",
  id: "",
  bridal: false,
  loyalityEligible: false,
  isLoggedIn: false,
  refresh: "",
  shippingData: null
};

export const user = (state = initialState, action: UserActions): State => {
  switch (action.type) {
    case "UPDATE_USER": {
      return { ...state, ...action.payload };
    }
    case "REFRESH_PAGE": {
      const newState = { ...state };
      newState.refresh = "true";
      return { ...newState };
    }
  }

  return state;
};
