import { State, UserActions } from "./typings";

export const initialState: State = {
  firstName: "",
  lastName: "",
  email: "",
  id: "",
  bridal: false,
  bridalId: 0,
  bridalCurrency: "INR",
  loyalityEligible: false,
  isLoggedIn: false,
  refresh: true,
  shippingData: null,
  phoneNumber: "",
  slab: "",
  loyaltyData: null,
  customerGroup: "",
  country: "",
  state: "",
  preferenceData: {}
};

export const user = (state = initialState, action: UserActions): State => {
  switch (action.type) {
    case "UPDATE_USER": {
      console.log("fetch update user=========", action.payload);
      return { ...state, ...action.payload };
    }
    case "REFRESH_PAGE": {
      const newState = { ...state };
      newState.refresh = !newState.refresh;
      return { ...newState };
    }

    case "RESET_META": {
      const state = initialState;
      return { ...state };
    }

    case "UPDATE_PREFERENCE_DATA": {
      const newState = { ...state };
      newState.preferenceData = action.payload;
      return { ...newState };
    }
  }

  return state;
};
