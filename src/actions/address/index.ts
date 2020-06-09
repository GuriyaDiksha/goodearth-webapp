import { actionCreator } from "utils/actionCreator";
import { AddressData } from "../../components/Address/typings";

export const updateAddressList = (addressList: AddressData[]) => {
  return actionCreator("UPDATE_ADDRESS_LIST", addressList);
};
