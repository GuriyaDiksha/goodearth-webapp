import { createContext } from "react";
import { AddressModes } from "./typings";
import { AddressData } from "components/Address/typings";

export const AddressContext = createContext({
  mode: "",
  setMode: (x: AddressModes) => {
    return;
  },
  editAddressData: {} || null,
  setEditAddressData: (x: AddressData) => {
    return;
  },
  currentCallBackComponent: "",
  openAddressForm: (x: AddressData) => {
    return;
  },
  closeAddressForm: () => {
    return;
  }
});
