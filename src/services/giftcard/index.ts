import { Dispatch } from "redux";
import API from "utils/api";
import { ApiResponse } from "typings/api";

export default {
  fetchCountryList: async function(dispatch: Dispatch) {
    const res = await API.get<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/address/gift_card_countries_state/"}`
    );
    return res;
  },
  fetchProductList: async function(dispatch: Dispatch) {
    const res = await API.get<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/giftcard/giftcard_product_list/"}`
    );
    return res;
  }
};
