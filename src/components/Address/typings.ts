import { Basket } from "typings/basket";

export type AddressData = AddressFormData & {
  id: number;
  countryName: string;
  isBridal: boolean;
  registrantName: string;
  coRegistrantName: string;
  occasion: string;
  isEdit?: boolean;
};

export type specifyShippingAddressResponse = {
  publishRemove: boolean;
  redirectHomepage: boolean;
  shippingCharge: number;
  pageReload: boolean;
  basket: Basket;
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
};

export type Props = {
  isBridal: boolean;
  selectedAddress?: AddressData;
  currentCallBackComponent: string;
  isActive?: boolean;
  next: (step: string) => void;
  finalizeAddress: (
    address: AddressData | null,
    activeStep: string,
    obj: { gstNo?: string; panPassportNo: string; gstType?: string }
  ) => void;
  hidesameShipping: boolean;
  activeStep?: string;
  // items: Basket;
  bridalId: string;
  isGoodearthShipping: boolean;
  addressType: string;
  addresses: AddressData[];
  // user:
  error: string;
};
export type AddressModes = "new" | "edit" | "list";
