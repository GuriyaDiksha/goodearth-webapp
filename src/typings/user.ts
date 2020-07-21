import { AddressData } from "components/Address/typings";

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  panPassport?: string;
  phone?: "";
  loyalityEligible: boolean;
  bridal: boolean;
  gender?: "male" | "female";
  isLoggedIn: boolean;
  refresh: string;
  shippingData: AddressData | null;
};
