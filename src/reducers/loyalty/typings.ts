import * as Actions from "actions/loyalty";
import { ActionType } from "typings/actionCreator";

export type LoyaltyPoints = {
  MembershipClub: string;
  AvailablePoint: number;
  MembershipExpiryDate: string;
  NextUpgradeMembershipClub: string;
  NextSlabProgress: number;
  AdditionalSpend: number;
  ExpiryPoints: number;
  ExpiryDate: string;
  PointRate: string;
  PointValue: string;
  Currency: {
    symbol: string;
    currencycode: string;
    currencyname: string;
  };
};

export type Landing = {
  heading: string;
  shortDescription: string;
  uploadIcon: string;
  level: string[];
};

export type State = {
  loyaltyPoints: LoyaltyPoints;
  landing: Landing[];
  transaction: Transaction;
};

export type LoyaltyActions = ActionType<typeof Actions>;

export type ItemDetail = {
  ItemCode: string;
  ItemName: string;
  ItemQuantity: number;
  ItemValue: number;
  ItemDiscount: number;
  ItemNetAmount: number;
  ItemEligiblity: string;
};

export type Records = {
  DocumentType: string;
  DocumentDate: string;
  DocumentNumber: string;
  Location: string;
  TransactionEarnPoints: number;
  TransactionRedeemPoints: number;
  ItemDetail: ItemDetail[];
};

export type Transaction = {
  total_records: number;
  total_pages: number;
  previouspage: number | string;
  nextpage: number | string;
  EarnPoints: number;
  RedeemPoints: number;
  BalancePoints: number;
  ExpiredPoints: number;
  records: Records[];
};
