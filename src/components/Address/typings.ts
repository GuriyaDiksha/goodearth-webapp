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
  loyaltyUpdated: boolean;
  shippable: boolean;
  currency: string | null;
  subTotal: number;
  total: number;
  voucherDiscounts: [];
  offerDiscounts: [];
  bridal: boolean;
  lineItems: [];
  totalWithOutGCItems: number;
  isTaxKnown: boolean;
  publishRemove: boolean;
  redirectHomepage: boolean;
  shippingCharge: number;
  pageReload: boolean;
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
