import { AddressData } from "components/Address/typings";

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  panPassport?: string;
  phoneNumber?: string;
  loyalityEligible: boolean;
  bridal: boolean;
  gender?: "male" | "female";
  isLoggedIn: boolean;
  refresh: boolean;
  shippingData: AddressData | null;
  slab: string;
};
