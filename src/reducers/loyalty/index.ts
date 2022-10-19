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
  landing: [],
  transaction: {
    total_records: 0,
    total_pages: 0,
    previouspage: "",
    nextpage: "",
    EarnPoints: 0,
    RedeemPoints: 0,
    BalancePoints: 0,
    ExpiredPoints: 0,
    records: []
  }
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
    case "UPDATE_TRANSACTION": {
      return { ...state, transaction: action.payload };
    }
    default: {
      return state;
    }
  }
};
