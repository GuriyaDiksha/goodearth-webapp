import { Dispatch } from "redux";
import API from "utils/api";
import { ApiResponse } from "typings/api";
import { updateShopData } from "actions/shop";
import { updateCurrency } from "actions/currency";
import { updateSales, updatePopupBgUrl } from "actions/info";
import { updateAnnouncement } from "actions/header";

export default {
  fetchShopLocator: async function(dispatch: Dispatch) {
    const res = await API.get<ApiResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/promotions/store_locator"}`
    );
    dispatch(updateShopData(res));
  },
  getCurrency: async function(dispatch: Dispatch, bridalKey?: string) {
    const curr: any = await API.get<ApiResponse>(
      dispatch,
      `${__API_HOST__}/myapi/common/current_currency${
        bridalKey ? "?bridal_key=" + bridalKey : ""
      }`
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
  getPopupBgUrl: async function(dispatch: Dispatch) {
    const data: any = await API.get(
      dispatch,
      `${__API_HOST__}/myapi/common/signup_bgimage/`
    );
    dispatch(updatePopupBgUrl(data.sign_up_bg_image));
  },
  getAnnouncement: async function(dispatch: Dispatch, bridalKey?: string) {
    const response: any = await API.get<ApiResponse>(
      dispatch,
      `${__API_HOST__}/myapi/promotions/announcement_bar/${
        bridalKey ? "?bridal_key=" + bridalKey : ""
      }`
    );
    dispatch(updateAnnouncement(response));
  }
};
