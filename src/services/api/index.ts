import { Dispatch } from "redux";
import API from "utils/api";
import { ApiResponse } from "typings/api";
import { updateShopData } from "actions/shop";
import { updateCurrency } from "actions/currency";
import { updateSales, updatePopupBgUrl } from "actions/info";
import { updateAnnouncement } from "actions/header";
import CacheService from "services/cache";

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
  getSalesStatus: async function(dispatch: Dispatch, bridalKey?: string) {
    const data: any = await API.get<ApiResponse>(
      dispatch,
      `${__API_HOST__ +
        "/myapi/common/sale_status" +
        (bridalKey ? `/?bridalKey=${bridalKey}` : "")}`
    );
    dispatch(updateSales(data.sale));
  },
  getPopupBgUrl: async function(dispatch: Dispatch) {
    let data: any = CacheService.get("popupBgUrl");
    if (!data) {
      const res = await API.get<any>(
        dispatch,
        `${__API_HOST__}/myapi/common/signup_bgimage/`
      );
      data = res.sign_up_bg_image;
      CacheService.set("popupBgUrl", data);
    }
    dispatch(updatePopupBgUrl(data));
  },
  getAnnouncement: async function(dispatch: Dispatch, bridalKey?: string) {
    const response: any = await API.get<ApiResponse>(
      dispatch,
      `${__API_HOST__}/myapi/promotions/announcement_bar/${
        bridalKey ? "?bridal_key=" + bridalKey : ""
      }`
    );
    dispatch(updateAnnouncement(response));
  },
  getMusicData: async function(dispatch: Dispatch) {
    const data: any = await API.get(
      dispatch,
      `${__API_HOST__}/myapi/promotions/audio_playlist/`
    );
    return data;
  }
};
