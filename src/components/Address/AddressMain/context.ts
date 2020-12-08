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
  activeStep: "",
  checkPinCode: (x: string): boolean => {
    return true;
  },
  isAddressValid: (address: AddressData): boolean => {
    return true;
  },
  markAsDefault: (x: AddressData) => {
    return;
  },
  setIsLoading: (x: boolean) => {
    return;
  },
  openAddressForm: (x?: AddressData) => {
    return;
  },
  closeAddressForm: () => {
    return;
  }
});
