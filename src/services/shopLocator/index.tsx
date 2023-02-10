import { Dispatch } from "redux";
import { ApiResponse } from "typings/api";
import API from "utils/api";

export default {
  fetchShopLocatorData: async function(dispatch: Dispatch) {
    const res = await API.get<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/promotions/store_locator"}`
    );
    return res;
  }
};
