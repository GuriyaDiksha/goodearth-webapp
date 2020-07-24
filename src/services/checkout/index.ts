import { Dispatch } from "redux";
import API from "utils/api";
import { ApiResponse } from "typings/api";

export default {
  applyGiftCard: async function(dispatch: Dispatch, formData: any) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/giftcard/apply_gc/"}`,
      formData
    );
    return res;
  },
  removeGiftCard: async function(dispatch: Dispatch, formData: any) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/giftcard/remove_gc/"}`,
      formData
    );
    return res;
  },
  removePromo: async function(dispatch: Dispatch, formData: any) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/giftcard/remove_voucher/"}`,
      formData
    );
    return res;
  },
  applyPromo: async function(dispatch: Dispatch, formData: any) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/giftcard/apply_voucher/"}`,
      formData
    );
    return res;
  },
  finalCheckout: async function(dispatch: Dispatch, formData: any) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/checkout/"}`,
      formData
    );
    return res;
  }
};
