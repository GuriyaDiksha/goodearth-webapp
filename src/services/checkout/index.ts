import { Dispatch } from "redux";
import API from "utils/api";
import { ApiResponse } from "typings/api";

export default {
  applyGiftCard: async function(dispatch: Dispatch, formData: any) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/giftcard/add_giftcard_in_basket/"}`,
      formData
    );
    return res;
  },
  applyPromo: async function(dispatch: Dispatch, formData: any) {
    const res = await API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/giftcard/add_giftcard_in_basket/"}`,
      formData
    );
    return res;
  }
};
