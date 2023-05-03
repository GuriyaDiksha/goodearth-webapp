import { actionCreator } from "utils/actionCreator";
import { AddressData } from "../../components/Address/typings";
import { PinCodeData } from "components/Formsy/PinCode/typings";
import { AddressMode, Country } from "components/Formsy/CountryCode/typings";

export const updateAddressList = (
  addressList: AddressData[],
  addressId?: number
) => {
  return actionCreator("UPDATE_ADDRESS_LIST", {
    addressList: addressList,
    addressId: addressId
  });
};

export const updatePinCodeList = (
  pinCodeData: PinCodeData,
  pinCodeList: string[]
) => {
  return actionCreator("UPDATE_PINCODE_LIST", {
    pinCodeData: pinCodeData,
    pinCodeList: pinCodeList
  });
};

export const updateCountryData = (countryData: Country[]) => {
  return actionCreator("UPDATE_COUNTRY_DATA", { countryData: countryData });
};

export const updateAddressMode = (mode: AddressMode) => {
  return actionCreator("ADDRESS_MODE", { mode: mode });
};
