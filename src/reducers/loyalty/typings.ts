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

export type State = { loyaltyPoints: LoyaltyPoints; landing: Landing[] };

export type LoyaltyActions = ActionType<typeof Actions>;
