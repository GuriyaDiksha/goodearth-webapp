import { AddressData } from "components/Address/typings";
import { Currency } from "./currency";

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  panPassport?: string;
  phoneNumber?: string;
  loyalityEligible: boolean;
  bridal: boolean;
  bridalId: number;
  bridalCurrency: Currency;
  gender?: "male" | "female";
  isLoggedIn: boolean;
  refresh: boolean;
  shippingData: AddressData | null;
  slab: string;
  loyaltyData: { [x: string]: any } | null;
  customerGroup: string;
};
