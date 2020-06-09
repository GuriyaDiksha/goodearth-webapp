import API from "utils/api";
import { Dispatch } from "redux";
import { AddressData } from "components/Address/typings";
import { updateAddressList } from "actions/address";

export default {
  fetchAddressList: async (dispatch: Dispatch) => {
    const data = await API.get<AddressData[]>(
      dispatch,
      `${__API_HOST__}/myapi/address/user_address`
    );
    return data;
  },
  makeDefault: async (dispatch: Dispatch) => {
    // implement makeDefault
    console.log("makeDefault");
  },
  addNewAddress: async (dispatch: Dispatch) => {
    // implement addNewAddress
    console.log("addNewAddress");
  },
  updateAddress: async (dispatch: Dispatch) => {
    // implement updateAddress
    console.log("updateAddress");
  },
  deleteAddress: async (dispatch: Dispatch, id: number) => {
    const data = await API.delete<AddressData[]>(
      dispatch,
      `${__API_HOST__}/myapi/address/delete_address/${id}`,
      {}
    );
    dispatch(updateAddressList(data));
    return data;
  },
  specifyShippingAddress: async (dispatch: Dispatch) => {
    // implement specifyShippingAddress
    console.log("specifyShippingAddress");
  },
  specifyBillingAddress: async (dispatch: Dispatch) => {
    // implement specifyBillingAddress
    console.log("specifyBillingAddress");
  }
};
