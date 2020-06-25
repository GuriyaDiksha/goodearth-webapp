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
