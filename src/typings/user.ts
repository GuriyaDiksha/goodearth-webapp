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
};
