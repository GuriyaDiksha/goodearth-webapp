import { Dispatch } from "redux";
import API from "utils/api";
import { ApiResponse } from "typings/api";
import { updateShopData } from "actions/shop";
import { updateCurrency } from "actions/currency";
import { updateSales } from "actions/info";

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
  },
  getSalesStatus: async function(dispatch: Dispatch) {
    const data: any = await API.get<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/common/sale_status"}`
    );
    dispatch(updateSales(data.sale));
  },
  getAnnouncement: async function(dispatch: Dispatch) {
    const response: any = await API.get<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/promotions/announcement_bar/"}`
    );
    return response;
  }
};
