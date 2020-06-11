import { createContext } from "react";
import { AddressModes } from "./typings";
import { AddressData } from "components/Address/typings";

export const AddressContext = createContext({
  mode: "",
  setMode: (x: AddressModes) => {
    return;
  },
  // editAddressData: {} || null,
  setEditAddressData: (x: AddressData) => {
    return;
  },
  currentCallBackComponent: "",
  checkPinCode: (x: string): boolean => {
    return true;
  },
  isAddressValid: (x: AddressData): boolean => {
    return true;
  },
  markAsDefault: (x: AddressData) => {
    return;
  },
  openAddressForm: (x: AddressData) => {
    return;
  },
  closeAddressForm: () => {
    return;
  }
});
