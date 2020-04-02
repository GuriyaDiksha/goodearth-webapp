import { State, BasketActions } from "./typings";

const initialState: State = {
  bridal: false,
  currency: "INR",
  isTaxKnown: false,
  lineItems: [],
  loyalityUpdated: false,
  offerDiscounts: [],
  shippable: false,
  subtotalExclusive: 0,
  totalExclusive: 0,
  totalTax: 0,
  totalWithoutGCItems: 0,
  voucherDiscounts: []
};

export const basket = (state = initialState, action: BasketActions): State => {
  switch (action.type) {
    case "UPDATE_BASKET": {
      return {
        ...state,
        ...action.payload
      };
    }
  }

  return state;
};
