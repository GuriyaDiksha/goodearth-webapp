import { Dispatch } from "redux";
import API from "utils/api";
import { ApiResponse, PopupResponse } from "typings/api";
import { updateShopData } from "actions/shop";
import { updateCurrency } from "actions/currency";
import {
  updateSales,
  updatePopupBgUrl,
  updateShowTimer,
  updateGiftWrap,
  updateDeliveryInstruction,
  updatePromo
} from "actions/info";
import { updateAnnouncement } from "actions/header";
import CacheService from "services/cache";
import HeaderService from "services/headerFooter";
import { updatePopup } from "actions/popup";
import { updateUser } from "actions/user";
import { AnnouncementBar } from "components/header/typings";
import { sanitizeContent } from "utils/validate";

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
      `${__API_HOST__}/myapi/common/current_currency/${
        bridalKey ? "?bridal_key=" + bridalKey : ""
      }`
    );
    dispatch(updateCurrency(curr));
  },
  getSalesStatus: async function(dispatch: Dispatch, bridalKey?: string) {
    const bridalKeyParam = bridalKey ? `${`?bridalKey=${bridalKey}`}` : "";
    const data: any = await API.get<ApiResponse>(
      dispatch,
      `${__API_HOST__}/myapi/common/sale_status/${bridalKeyParam}`
    );
    dispatch(updateSales(data.sale));
    dispatch(updateUser({ customerGroup: data.customerGroup || "" }));
    if (bridalKey) {
      dispatch(updateCurrency(data.currency));
    }
    dispatch(updateShowTimer(data.showTimer));
    if (data.showTimer) {
      await HeaderService.getSaleTimerData(dispatch);
    }
    dispatch(updateGiftWrap(data.showGiftwrap));
    dispatch(updateDeliveryInstruction(data.showDeliveryInstruction));
    dispatch(updatePromo(data.showPromo));
  },
  getPopups: async function(dispatch: Dispatch) {
    const res = await API.get<PopupResponse>(
      dispatch,
      `${__API_HOST__}/myapi/static/fetch_pop_up`
    );
    dispatch(updatePopup(res.data));
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
    const response = await API.get<AnnouncementBar>(
      dispatch,
      `${__API_HOST__}/myapi/promotions/announcement_bar_v1/${
        bridalKey ? "?bridal_key=" + bridalKey : ""
      }`
    );
    response.data.map(item => {
      item.content = sanitizeContent(item.content);
      item.ctaLabel = sanitizeContent(item.ctaLabel);
    });
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
