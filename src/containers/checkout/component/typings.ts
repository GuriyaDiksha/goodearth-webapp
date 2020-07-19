import { AddressData } from "components/Address/typings";
import { Currency } from "typings/currency";
import { Basket } from "typings/basket";

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

export type OrderProps = {
  mobile: boolean;
  currency: Currency;
  basket: Basket;
  page: string;
  shippingAddress: any;
  salestatus: boolean;
  validbo: boolean;
};

export type PromoProps = {
  isActive: boolean;
  user: any;
  next: (step: string) => void;
};

export type PaymentProps = {
  isActive: boolean;
  user: any;
  currency: Currency;
  checkout: (data: any) => void;
};

export type BalanceProps = {
  emailID: string;
  remValues: string;
  currStatus: string | null;
  createDate: string;
  expiryDate: string;
  type: string;
  currCode: string;
  fullValue: string;
  issuedFrom: string;
  code: string;
};

export interface GiftListProps extends BalanceProps {
  onClose: (data: string) => void;
}

export type GiftState = {
  txtvalue: string;
  error: string;
  newCardBox: boolean;
  giftList: BalanceProps[];
  toggelOtp: boolean;
};
