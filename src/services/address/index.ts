import API from "utils/api";
import { Dispatch } from "redux";
import {
  AddressData,
  AddressFormData,
  CustomDuties,
  specifyShippingAddressResponse
} from "components/Address/typings";
import { PinCodeData } from "components/Formsy/PinCode/typings";
import { updateAddressList, updateCustomDuties } from "actions/address";
import {
  specifyBillingAddressData,
  validateGSTData,
  validateGSTDataResponse
} from "containers/checkout/typings";
import { updateBasket } from "actions/basket";
import CacheService from "services/cache";
import { MESSAGE } from "constants/messages";
import { showGrowlMessage } from "../../utils/validate";

export default {
  fetchAddressList: async (
    dispatch: Dispatch,
    boId?: string,
    isGcCheckout = false
  ) => {
    const data = await API.get<AddressData[]>(
      dispatch,
      `${__API_HOST__}/myapi/address/user_address?isGcCheckout=${isGcCheckout}${
        boId ? `&boId=${boId}` : ""
      }`
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
  specifyShippingAddress: async (
    dispatch: Dispatch,
    id: number,
    isBridal: boolean,
    history: any,
    boId?: string
  ) => {
    const data = await API.post<specifyShippingAddressResponse>(
      dispatch,
      `${__API_HOST__}/myapi/address/specify_shipping_address/?source=checkout${
        isBridal ? "&isBridal=true" : ""
      }`,
      { shippingAddressId: id, boId }
    );
    const {
      publishRemove,
      updated,
      updatedRemovedItems,
      unshippableRemove,
      unshippableProducts,
      redirectToCart
    } = data.data.basket;
    if (
      (updated || publishRemove) &&
      updatedRemovedItems &&
      updatedRemovedItems.length > 0
    ) {
      showGrowlMessage(
        dispatch,
        MESSAGE.PRODUCT_UNPUBLISHED,
        0,
        undefined,
        updatedRemovedItems
      );
    }
    if (unshippableRemove) {
      showGrowlMessage(
        dispatch,
        MESSAGE.PRODUCT_UNSHIPPABLE_REMOVED,
        0,
        undefined,
        unshippableProducts
      );
    }
    dispatch(updateBasket(data.data.basket));
    if (redirectToCart) {
      history?.push("/cart", {});
    }
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
  },
  fetchCustomDuties: async (dispatch: Dispatch, currency: string) => {
    const data = await API.post<CustomDuties>(
      dispatch,
      `${__API_HOST__}/myapi/shipping/custom_duties/`,
      { currency }
    );
    dispatch(updateCustomDuties(data));
    return data;
  },
  validateGST: async (dispatch: Dispatch, validateGSTData: validateGSTData) => {
    const data = await API.post<validateGSTDataResponse>(
      dispatch,
      `${__API_HOST__}/myapi/common/validate_gst/`,
      validateGSTData
    );
    return data;
  }
};
