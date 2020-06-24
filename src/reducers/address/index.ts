import { State, AddressActions } from "./typings";

const initialState: State = {
  addressList: [],
  pinCodeList: [],
  pinCodeData: {},
  countryData: []
};
export const address = (
  state = initialState,
  action: AddressActions
): State => {
  switch (action.type) {
    case "UPDATE_ADDRESS_LIST": {
      return {
        ...state,
        ...action.payload
      };
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
  }
  return state;
};
