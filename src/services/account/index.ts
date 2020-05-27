import API from "utils/api";
import { Dispatch } from "redux";
import { ProfileResponse } from "containers/myAccount/components/MyProfile/typings";
import { MyOrdersResponse } from "containers/myAccount/components/MyOrder/typings";

export default {
  fetchProfileData: async (dispatch: Dispatch) => {
    const data = await API.get<ProfileResponse>(
      dispatch,
      "http://api.goodearth.in/myapi/customer/profile"
    );
    return data;
  },
  updateProfileData: async (dispatch: Dispatch, formData: FormData) => {
    const data = await API.post<ProfileResponse>(
      dispatch,
      "http://api.goodearth.in/myapi/customer/update_profile/",
      formData
    );
    return data;
  },
  fetchMyOrders: async (dispatch: Dispatch) => {
    const data = await API.get<MyOrdersResponse>(
      dispatch,
      "http://api.goodearth.in/myapi/order/my_orders"
    );
    return data;
  }
};
