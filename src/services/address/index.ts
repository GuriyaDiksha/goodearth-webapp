import API from "utils/api";
import { Dispatch } from "redux";
import { AddressData, AddressFormData } from "components/Address/typings";
import { PinCodeData } from "components/Formsy/PinCode/typings";
import { updateAddressList } from "actions/address";

export default {
  fetchAddressList: async (dispatch: Dispatch) => {
    const data = await API.get<AddressData[]>(
      dispatch,
      `${__API_HOST__}/myapi/address/user_address`
    );
    return data;
  },
  fetchPinCodeData: async (dispatch: Dispatch) => {
    const data = await API.get<{ data: PinCodeData }>(
      dispatch,
      `${__API_HOST__}/myapi/address/pincode_state/`
    );
    return data;
  },

  makeDefault: async (dispatch: Dispatch) => {
    // implement makeDefault
    console.log("makeDefault");
  },
  addNewAddress: async (dispatch: Dispatch, formData: AddressFormData) => {
    const data = await API.post<AddressData[]>(
      dispatch,
      `${__API_HOST__}/myapi/address/save_address/`,
      formData
    );
    dispatch(updateAddressList(data));
    return data;
  },
  updateAddress: async (
    dispatch: Dispatch,
    formData: AddressFormData,
    id: number
  ) => {
    const data = await API.put<AddressData[]>(
      dispatch,
      `${__API_HOST__}/myapi/address/update_address/${id}`,
      formData
    );
    dispatch(updateAddressList(data));
    return data;
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
