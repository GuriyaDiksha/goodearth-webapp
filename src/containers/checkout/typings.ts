export type specifyBillingAddressData = {
  billingAddressId: number;
  gstNo?: string;
  gstType?: string;
  panPassportNo?: string;
  source: string;
};

export type validateGSTData = {
  billingAddressId: number;
  gstNo: string;
  gstType: string;
};

export type validateGSTDataResponse = {
  is_validated: boolean;
};
