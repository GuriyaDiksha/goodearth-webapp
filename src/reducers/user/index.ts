import { State, UserActions } from "./typings";

export const initialState: State = {
  firstName: "",
  lastName: "",
  email: "",
  id: "",
  bridal: false,
  loyalityEligible: false
};

export const user = (state = initialState, action: UserActions): State => {
  switch (action.type) {
    case "UPDATE_USER": {
      return { ...state, ...action.payload };
    }
  }

  return state;
};
