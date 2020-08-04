import API from "utils/api";
import { Dispatch } from "redux";
import { ProfileResponse } from "containers/myAccount/components/MyProfile/typings";
import { MyOrdersResponse } from "containers/myAccount/components/MyOrder/typings";
import { BalanceProps } from "containers/myAccount/components/Balance/typings";
import { ConfirmResetPasswordResponse } from "containers/resetPassword/typings";

export default {
  fetchProfileData: async (dispatch: Dispatch) => {
    const data = await API.get<ProfileResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/customer/profile"}`
    );
    return data;
  },
  updateProfileData: async (dispatch: Dispatch, formData: FormData) => {
    const data = await API.post<ProfileResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/customer/update_profile/"}`,
      formData
    );
    return data;
  },
  changePassword: async (dispatch: Dispatch, formData: FormData) => {
    const data = await API.post<any>(
      dispatch,
      `${__API_HOST__ + "/myapi/auth/change_password/"}`,
      formData
    );
    return data;
  },
  fetchMyOrders: async (dispatch: Dispatch) => {
    const data = await API.get<MyOrdersResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/order/my_orders"}`
    );
    return data;
  },
  fetchOrderBy: async (dispatch: Dispatch, id: string, email: string) => {
    const data = await API.get<MyOrdersResponse>(
      dispatch,
      `${__API_HOST__ +
        "/myapi/order/my_orders/?orderNumber="}${id}&email=${email}`
    );
    return data;
  },
  balanceCheck: async (dispatch: Dispatch, formData: FormData) => {
    const data = await API.post<BalanceProps>(
      dispatch,
      `${__API_HOST__ + "/myapi/giftcard/giftcard_check_balance/"}`,
      formData
    );
    const temp = {
      ...data,
      ...formData
    };
    return temp;
  },
  sendOtpBalance: async (dispatch: Dispatch, formData: FormData) => {
    const data = await API.post<BalanceProps>(
      dispatch,
      `${__API_HOST__ + "/myapi/giftcard/send_otp_for_anonymous_user/"}`,
      formData
    );
    return data;
  },
  sendOtpRedeem: async (dispatch: Dispatch, formData: FormData) => {
    const data = await API.post<BalanceProps>(
      dispatch,
      `${__API_HOST__ + "/mobiquest/send_loyalty_otp/"}`,
      formData
    );
    return data;
  },
  sendOtpGiftcard: async (dispatch: Dispatch, formData: FormData) => {
    const data = await API.post<BalanceProps>(
      dispatch,
      `${__API_HOST__ + "/myapi/giftcard/send_giftcard_otp/"}`,
      formData
    );
    const temp = {
      ...data,
      ...formData
    };
    return temp;
  },
  checkOtpBalance: async (dispatch: Dispatch, formData: any) => {
    const data = await API.post<BalanceProps>(
      dispatch,
      `${__API_HOST__ +
        "/myapi/giftcard/giftcard_balance_check_for_anonymous_user/"}`,
      formData
    );
    const temp = {
      ...data
    };
    temp["code"] = formData.code;
    return temp;
  },
  checkOtpRedeem: async (dispatch: Dispatch, formData: any) => {
    const data = await API.post<BalanceProps>(
      dispatch,
      `${__API_HOST__ + "/mobiquest/validate_loyalty_otp/"}`,
      formData
    );
    return data;
  },
  confirmResetPassword: async (dispatch: Dispatch, formData: any) => {
    const data = await API.post<ConfirmResetPasswordResponse>(
      dispatch,
      `${__API_HOST__}/myapi/auth/confirm_reset_password/`,
      formData
    );
    return data;
  },
  activateGiftCard: async (dispatch: Dispatch, formData: FormData) => {
    const data = await API.post<BalanceProps>(
      dispatch,
      `${__API_HOST__ + "/myapi/giftcard/giftcard_activate/"}`,
      formData
    );
    const temp = {
      ...data
      // ...formData
    };
    return temp;
  }
};
