import { State, BasketActions } from "./typings";

const initialState: State = {
  isBridal: false,
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
  voucherDiscounts: [],
  shippingCharge: 0,
  total: 0,
  subTotal: 0,
  giftCards: [],
  loyalty: [],
  redirectToCart: ""
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
