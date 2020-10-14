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
  removeRedeem: async function(dispatch: Dispatch) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/mobiquest/remove_loyalty_points/"}`,
      {}
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
  },
  getLoyaltyPoints: async function(dispatch: Dispatch, formData: any) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/mobiquest/loyalty_points_and_history/"}`,
      formData
    );
    return res;
  },
  getBoDetail: async function(dispatch: Dispatch, id: string) {
    const res = await API.get<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/checkout/get_bo_details/?boId=" + id}`
    );
    return res;
  },
  clearBoBasket: async function(dispatch: Dispatch) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/basket/clear_bo_basket/"}`,
      {}
    );
    return res;
  }
};
