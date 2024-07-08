import { isFormModuleOpen } from "./../../actions/address/index";
import * as Actions from "actions/address";
import { ActionType } from "typings/actionCreator";
import {
  AddressData,
  AddressModes,
  CustomDuties
} from "../../components/Address/typings";
import { PinCodeData } from "../../components/Formsy/PinCode/typings";
import { Country } from "components/Formsy/CountryCode/typings";

export type State = {
  addressList: AddressData[];
  pinCodeList: string[];
  pinCodeData: PinCodeData;
  countryData: Country[];
  // bridalAddressId: number;
  shippingAddressId: number;
  billingAddressId: number;
  mode: AddressModes;
  customDuties: CustomDuties;
  sameAsShipping: boolean;
  isFormModuleOpen: boolean;
};

export { Actions };

export type AddressActions = ActionType<typeof Actions>;
