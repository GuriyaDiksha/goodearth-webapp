import { AddressData } from "components/Address/typings";

export type LoginProps = {
  isActive: boolean;
  user: any;
};

export type AddressProps = {
  isActive?: boolean;
  activeStep: string;
  // user: any;
  isBridal?: boolean;
  selectedAddress?: AddressData;
  next: (step: string) => void;
  finalizeAddress: (
    address: AddressData | null,
    activeStep: string,
    obj: { gstNo?: string; panPassportNo: string; gstType?: string }
  ) => void;
  openAddressForm: (address?: AddressData) => void;
  hidesameShipping: boolean;
  // items: Basket;
  bridalId: string;
  isGoodearthShipping: boolean;
  // addressType: string;
  addresses: AddressData[];
  // user:
  error: string;
};
