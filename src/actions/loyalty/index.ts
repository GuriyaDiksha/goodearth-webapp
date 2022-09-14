import { actionCreator } from "utils/actionCreator";
import { LoyaltyPoints } from "reducers/loyalty/typings";

export const updateLoyaltyPoints = (loyaltyPoints: LoyaltyPoints) =>
  actionCreator("UPDATE_LOYALTY_POINTS", loyaltyPoints);
