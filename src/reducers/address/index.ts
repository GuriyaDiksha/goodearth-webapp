import { State, AddressActions } from "./typings";

const initialState: State = {
  addressList: [],
  pinCodeList: [],
  pinCodeData: {},
  countryData: [],
  shippingAddressId: 0,
  billingAddressId: 0,
  mode: "list",
  customDuties: { message: "" },
  sameAsShipping: true
};
export const address = (
  state = initialState,
  action: AddressActions
): State => {
  switch (action.type) {
    case "UPDATE_ADDRESS_LIST": {
      if (action.payload.addressId) {
        const oldState = state.addressList.map(e => {
          if (e?.id === action.payload.addressId) {
            e.isDefaultForShipping = true;
          }
          return e;
        });
        return {
          ...state,
          addressList: oldState
        };
      } else {
        return {
          ...state,
          addressList: action.payload.addressList
        };
      }
    }
    case "UPDATE_PINCODE_LIST": {
      return {
        ...state,
        ...action.payload
      };
    }
    case "UPDATE_COUNTRY_DATA": {
      return {
        ...state,
        ...action.payload
      };
    }
    case "UPDATE_SHIPPING_ADDRESS_ID": {
      return {
        ...state,
        ...action.payload
      };
    }
    case "UPDATE_BILLING_ADDRESS_ID": {
      return {
        ...state,
        ...action.payload
      };
    }
    case "UPDATE_ADDRESS_MODE": {
      return {
        ...state,
        ...action.payload
      };
    }
    case "UPDATE_CUSTOM_DUTIES": {
      return {
        ...state,
        ...action.payload
      };
    }
    case "UPDATE_SAME_AS_SHIPPING": {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
};
