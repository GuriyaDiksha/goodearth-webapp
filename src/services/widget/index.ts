import { Dispatch } from "redux";
import API from "utils/api";
import { ConsentDetail, WidgetDetail } from "./typings";
import { updateWidgetDetail, updateConsentDetail } from "actions/widget";

export default {
  getWidgetDetail: async function(dispatch: Dispatch, region: string) {
    const res = await API.get<WidgetDetail>(
      dispatch,
      `${__API_HOST__}/myapi/gdpr/widget_detail/${region}`
    );
    dispatch(updateWidgetDetail(res));
  },
  postConsentDetail: async function(
    dispatch: Dispatch,
    payload: ConsentDetail
  ) {
    const res = await API.post<string>(
      dispatch,
      `${__API_HOST__}/myapi/gdpr/log_consents/`,
      payload
    );
    dispatch(updateConsentDetail(res));
  }
};
