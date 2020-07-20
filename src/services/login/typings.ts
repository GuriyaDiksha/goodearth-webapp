import { Country } from "components/Formsy/CountryCode/typings";

export type checkUserPasswordResponse = {
  resStatus: boolean;
  url: string;
  message: string;
  emailExist: boolean;
  passwordExist: boolean;
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
};

export type registerResponse = {
  token: string;
  firstname: string;
  lastname: string;
  email: string;
  userId: string;
  gender: string;
  customerSlab: string;
};

export type countryDataResponse = Country[];
