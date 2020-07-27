import { Dispatch } from "redux";
import API from "utils/api";
import { ApiResponse } from "typings/api";
import { updateShopData } from "actions/shop";
import { updateCurrency } from "actions/currency";

export default {
  fetchShopLocator: async function(dispatch: Dispatch) {
    const res = await API.get<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/promotions/store_locator"}`
    );
    dispatch(updateShopData(res));
  },
  getCurrency: async function(dispatch: Dispatch) {
    const curr: any = await API.get<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/common/current_currency"}`
    );
    dispatch(updateCurrency(curr));
  }
};
