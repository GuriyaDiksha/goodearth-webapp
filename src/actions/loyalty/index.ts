import { actionCreator } from "utils/actionCreator";
import { Landing, LoyaltyPoints } from "reducers/loyalty/typings";

export const updateLoyaltyPoints = (loyaltyPoints: LoyaltyPoints) =>
  actionCreator("UPDATE_LOYALTY_POINTS", loyaltyPoints);

export const updateLoyaltyLanding = (landing: Landing) =>
  actionCreator("UPDATE_LOYALTY_LANDING", landing);
