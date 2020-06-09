import { State, AddressActions } from "./typings";

export const address = (state = [], action: AddressActions): State => {
  switch (action.type) {
    case "UPDATE_ADDRESS_LIST": {
      return action.payload;
    }
  }
  return state;
};
