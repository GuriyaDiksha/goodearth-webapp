import { createContext } from "react";
import { AddressModes } from "../typings";
import { AddressData } from "components/Address/typings";

export const AddressContext = createContext({
  mode: "",
  setMode: (x: AddressModes) => {
    return;
  },
  setEditAddressData: (x: AddressData) => {
    return;
  },
  currentCallBackComponent: "",
  checkPinCode: (x: string): boolean => {
    return true;
  },
  isAddressValid: (postCode: string, state: string): boolean => {
    return true;
  },
  markAsDefault: (x: AddressData) => {
    return;
  },
  setIsLoading: (x: boolean) => {
    return;
  },
  openAddressForm: (x: AddressData) => {
    return;
  },
  closeAddressForm: () => {
    return;
  }
});
