import { AddressData } from "components/Address/typings";
import { Currency } from "typings/currency";
import { Basket } from "typings/basket";

export type BreadcrumbProps = {
  active: string;
};
export type LoginProps = {
  isActive: boolean;
  user: any;
  next?: (step: string) => void;
  boEmail?: string;
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
  errorNotification?: string;
  currentStep: number;
  isGcCheckout?: boolean;
};

export type OrderProps = {
  mobile: boolean;
  currency: Currency;
  basket: Basket;
  page?: string;
  shippingAddress?: any;
  salestatus?: boolean;
  validbo?: boolean;
  goLogin?: (event?: React.MouseEvent, nextUrl?: string) => void;
  setCheckoutMobileOrderSummary?: (data: boolean) => void;
  isLoading?: any;
  currentmethod?: any;
  isPaymentNeeded?: any;
  onsubmit?: () => any;
  checkoutMobileOrderSummary?: boolean;
  // boId?: string;
  tablet?: boolean;
};

export type PromoProps = {
  isActive: boolean;
  user: any;
  next: (step: string) => void;
  selectedAddress: any;
  activeStep: string;
  currentStep: number;
};

export type PaymentProps = {
  isActive: boolean;
  user: any;
  currency: Currency;
  shippingAddress: any;
  salestatus: boolean;
  checkout: (data: any) => any;
  gstNo?: string;
  activeStep: string;
  currentStep: number;
  isGcCheckout: boolean;
};

export type PopupProps = {
  closeModal: (data?: any) => any;
  acceptCondition: (data?: any) => any;
};

export type BalanceProps = {
  cardId: string;
  cardType: string;
  appliedAmount: string;
  cardValue: string;
  remainingAmount: string;
  code: string;
  expiryDate: string;
  createdDate: string;
};

export interface GiftListProps extends BalanceProps {
  onClose: (data: string, type: string) => void;
  currStatus: string;
  currency: Currency;
  type?: string;
  isLoggedIn: boolean;
}

export type voucher = {
  code: string;
  endDateTime: string;
  name: string;
  startDateTime: string;
};

export interface PromoListProps extends voucher {
  onClose: (data: string) => void;
  currStatus: string;
  currency: Currency;
  amount: string;
  name: string;
}

export type GiftState = {
  txtvalue: string;
  error: string;
  newCardBox: boolean;
  toggleOtp?: boolean;
  isActivated: boolean;
  cardType?: string;
  isLoader?: boolean;
  isError?: boolean;
  isEmptyInput?: boolean;
  codeApplied?: boolean;
};

export type RedeemState = {
  txtvalue: number | string;
  error: string;
  newCardBox: boolean;
  toggleOtp: boolean;
  isActivated: boolean;
  showTooltip: boolean;
  showTooltipTwo: boolean;
};

// export type ReddemProps = {
//   loyaltyData: any;
// };
