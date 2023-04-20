import Formsy from "formsy-react";
import React from "react";
import { Basket } from "typings/basket";

export type AddressData = AddressFormData & {
  id: number;
  countryName: string;
  isBridal: boolean;
  registrantName: string;
  coRegistrantName: string;
  occasion: string;
  isTulsi?: boolean;
  isBackendOrder?: boolean;
};

export type specifyShippingAddressResponse = {
  status: boolean;
  message: string;
  data: {
    basket: Basket;
  };
};

export type AddressFormData = {
  firstName: string;
  lastName: string;
  emailId: string;
  city: string;
  postCode: string;
  country: string;
  phoneCountryCode: string;
  phoneNumber: string;
  isDefaultForShipping: boolean;
  isDefaultForBilling: boolean;
  line1: string;
  line2: string;
  state: string;
  province?: string;
};

export type Props = {
  showDefaultAddressOnly?: boolean;
  isBridal: boolean;
  selectedAddress?: AddressData;
  currentCallBackComponent: string;
  isActive?: boolean;
  next?: (step: string) => void;
  finalizeAddress?: (
    address: AddressData | null,
    activeStep: string,
    obj: { gstNo?: string; panPassportNo: string; gstType?: string }
  ) => void;
  hidesameShipping?: boolean;
  activeStep?: string;
  // items: Basket;
  bridalId?: string;
  isGoodearthShipping?: boolean;
  addressType: string;
  addresses: AddressData[];
  setCurrentSection?: () => void;
  createRegistry?: () => void;
  // user:
  error: string;
  errorNotification?: string;
  innerRef?: any;
  codeRef?: React.Ref<any>;
  phoneRef?: any;
  whatsappFormRef?: React.RefObject<Formsy>;
  whatsappNoError?: string;
};
export type AddressModes = "new" | "edit" | "list";
