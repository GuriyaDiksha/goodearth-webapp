import { State, BasketActions } from "./typings";

const initialState: State = {
  finalDeliveryDate: "",
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
  redirectToCart: "",
  isOnlyGiftCart: false,
  showCouponSection: true,
  publishRemove: false,
  updated: false,
  addnewGiftcard: 0,
  bridal: false,
  bridalProfileId: 0,
  bridalAddressId: 0,
  freeShippingApplicable: 1000000000,
  freeShippingThreshold: 1000000000,
  updatedRemovedItems: [],
  redirectHomepage: false,
  subTotalWithShipping: 0
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
