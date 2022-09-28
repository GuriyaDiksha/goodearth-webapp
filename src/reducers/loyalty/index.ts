import { State, LoyaltyActions } from "./typings";

const initialState: State = {
  loyaltyPoints: {
    MembershipClub: "",
    AvailablePoint: 0,
    MembershipExpiryDate: "",
    NextUpgradeMembershipClub: "",
    NextSlabProgress: 0,
    AdditionalSpend: 0,
    ExpiryPoints: 0,
    ExpiryDate: "",
    PointRate: "",
    PointValue: "",
    Currency: {
      symbol: "",
      currencycode: "",
      currencyname: ""
    }
  },
  landing: []
};

export const loyalty = (
  state: State = initialState,
  action: LoyaltyActions
) => {
  switch (action.type) {
    case "UPDATE_LOYALTY_POINTS": {
      return { ...state, loyaltyPoints: action.payload };
    }
    case "UPDATE_LOYALTY_LANDING": {
      return { ...state, landing: action.payload };
    }
    default: {
      return state;
    }
  }
};
