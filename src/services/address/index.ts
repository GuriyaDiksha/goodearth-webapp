import API from "utils/api";
import { Dispatch } from "redux";
import {
  AddressData,
  AddressFormData,
  specifyShippingAddressResponse
} from "components/Address/typings";
import { PinCodeData } from "components/Formsy/PinCode/typings";
import { updateAddressList } from "actions/address";
import { specifyBillingAddressData } from "containers/checkout/typings";
import { updateBasket } from "actions/basket";
import CacheService from "services/cache";
import { showMessage } from "actions/growlMessage";
import { PRODUCT_UNPUBLISHED } from "constants/messages";

export default {
  fetchAddressList: async (dispatch: Dispatch) => {
    const data = await API.get<AddressData[]>(
      dispatch,
      `${__API_HOST__}/myapi/address/user_address`
    );
    return data;
  },
  fetchPinCodeData: async (dispatch: Dispatch) => {
    const pinCodeData = CacheService.get("pinCodeData") as PinCodeData;
    if (pinCodeData && Object.keys(pinCodeData).length > 0) {
      return pinCodeData;
    }
    const data = await API.get<{ data: PinCodeData }>(
      dispatch,
      `${__API_HOST__}/myapi/address/pincode_state/`
    );
    CacheService.set("pinCodeData", data.data);
    return data.data;
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
  specifyShippingAddress: async (dispatch: Dispatch, id: number) => {
    const data = await API.post<specifyShippingAddressResponse>(
      dispatch,
      `${__API_HOST__}/myapi/address/specify_shipping_address/?source=checkout`,
      { shippingAddressId: id }
    );
    if (data.data.basket.publishRemove) {
      dispatch(showMessage(PRODUCT_UNPUBLISHED));
    }
    dispatch(updateBasket(data.data.basket));
    return data;
  },
  specifyBillingAddress: async (
    dispatch: Dispatch,
    specifyBillingAddressData: specifyBillingAddressData
  ) => {
    const data = await API.post<string>(
      dispatch,
      `${__API_HOST__}/myapi/address/specify_billing_address/`,
      specifyBillingAddressData
    );
    return data;
  }
};
