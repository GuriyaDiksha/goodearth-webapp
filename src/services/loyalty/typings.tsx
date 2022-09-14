import { LoyaltyPoints } from "reducers/loyalty/typings";

export type Payload = {
  email: string;
};

export type LoyaltyPointsResponse = {
  status: string;
  statuscode: string;
  message: string;
  CustomerPointInformation: LoyaltyPoints;
};
