import { Dispatch } from "redux";
import API from "utils/api";
import { WidgetDetail } from "./typings";
import { updateWidgetDetail } from "actions/widget";

export default {
  getWidgetDetail: async function(dispatch: Dispatch, region: string) {
    const res = await API.get<WidgetDetail>(
      dispatch,
      `${__API_HOST__}/myapi/gdpr/widget_detail/${region}`
    );
    dispatch(updateWidgetDetail(res));
  }
};
