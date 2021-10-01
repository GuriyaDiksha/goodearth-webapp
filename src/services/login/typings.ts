import { Country } from "components/Formsy/CountryCode/typings";

export type checkUserPasswordResponse = {
  resStatus: boolean;
  url: string;
  message: string;
  emailExist: boolean;
  passwordExist: boolean;
  invalidDomain: boolean;
  verificationEmailSent: boolean;
};

export type logoutResponse = {
  message?: string;
  detail?: string;
};

export type resetPasswordResponse = {
  success: string;
};

export type loginResponse = {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  oldBasketHasItems: boolean;
  publishRemove: boolean;
  updated: boolean;
  updatedRemovedItems: string[];
  customerGroup: string;
};

export type registerResponse = {
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  gender: string;
  customerSlab: string;
};

export type countryDataResponse = Country[];

export type sendVerificationEmailResponse = {
  success: boolean;
  alreadyVerified: boolean;
  email: string;
  msg: string;
};

export type verifyEmailResponse = {
  status: boolean;
  alreadyLoggedIn: boolean;
  alreadyActive: boolean;
  expired: boolean;
  invalidLink: boolean;
  message?: string;
  email: string;
};
