export type PasswordProps = {
  setCurrentSection: () => void;
};
export type State = {
  isActive: boolean;
  isActiveCN: boolean;
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
  status?: "active" | "locked" | "expired" | "inactive" | "invalid";
};

export interface GiftListProps extends BalanceProps {
  conditionalRefresh: boolean;

  // showLocked: boolean;
  // showExpired: boolean;
  // showInactive: boolean;
  onClose: (data: string) => void;
  viewOnly?: boolean;
  isLoggedIn: boolean;
}

export type GiftState = {
  // showInactive: boolean;
  // showLocked: boolean;
  // showExpired: boolean;
  conditionalRefresh: boolean;
  txtvalue: string;
  error: string;
  newCardBox: boolean;
  giftList: BalanceProps[];
  toggleOtp: boolean;
  toggleResetOtpComponent: boolean;
  disable: boolean;
};

export type PrefernecesProps = {
  subscribe: boolean;
  whatsappNo: string;
  whatsappNoCountryCode: string;
  whatsappSubscribe: boolean;
};
