import API from "utils/api";
import { Dispatch } from "redux";
import { ProfileResponse } from "containers/myAccount/components/MyProfile/typings";
import { MyOrdersResponse } from "containers/myAccount/components/MyOrder/typings";
import { BalanceProps } from "containers/myAccount/components/Balance/typings";
import { ConfirmResetPasswordResponse } from "containers/resetPassword/typings";
// import CookieService from "services/cookie";
import { updateCookies } from "actions/cookies";
import { resetMeta } from "actions/user";
import MetaService from "services/meta";
import WishlistService from "services/wishlist";
import BasketService from "services/basket";

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
  fetchInShopOrders: async (dispatch: Dispatch, email: string) => {
    const data = await API.post<any>(
      dispatch,
      `${__OMNI_HOST__}/omni/customer_offline_orders_web/?email=${email}`,
      {}
    );
    return data;
  },
  fetchOrderBy: async (dispatch: Dispatch, id: string, email: string) => {
    const data = await API.get<MyOrdersResponse>(
      dispatch,
      `${__API_HOST__ +
        "/myapi/order/my_orders?orderNumber="}${id}&email=${email}`
    );
    return data;
  },
  fetchEmailbyOrder: async (dispatch: Dispatch, id: string) => {
    const data = await API.get<MyOrdersResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/order/get_order_email?orderNumber="}${id}`
    );
    return data;
  },
  fetchCourierData: async (dispatch: Dispatch, order: string) => {
    const courier = await new Promise((resolve, reject) => {
      fetch(
        `${__API_HOST__}/myapi/order/courier_tracking_api/?order_number=${order}`,
        { method: "GET" }
      )
        .then(resp => resp.json())
        .then(data => {
          if (data.order_statuses) {
            resolve(data);
          } else {
            resolve("error");
          }
        });
    });
    return courier;
  },
  setGaStatus: async (dispatch: Dispatch, formData: any) => {
    const data = await API.post<MyOrdersResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/order/push_to_ga_update/"}`,
      formData
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
  checkGiftCard: async (dispatch: Dispatch, code: string) => {
    const data = await API.post<{
      currStatus: string;
      type: string;
      curr: string;
      message?: string;
      status?: boolean;
    }>(dispatch, `${__API_HOST__}/myapi/giftcard/check_gift_card_status/`, {
      code
    });
    return data;
  },
  getLoyaltyTransactions: async (dispatch: Dispatch, formData: FormData) => {
    const data = await API.post(
      dispatch,
      `${__API_HOST__}/mobiquest/show_loyalty_transaction/`,
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
    // do same as logout
    document.cookie = "atkn=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    dispatch(updateCookies({ tkn: "" }));
    MetaService.updateMeta(dispatch, {}).catch(err => {
      console.log(err);
    });
    WishlistService.resetWishlist(dispatch);
    BasketService.fetchBasket(dispatch).catch(err => {
      console.log(err);
    });
    dispatch(resetMeta(undefined));
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
  },
  fetchInshopOrder: async (dispatch: Dispatch, email: string) => {
    const courier = await new Promise((resolve, reject) => {
      fetch(
        `${__OMNI_HOST__}/omni/customer_offline_orders_web/?email=${email}`,
        { method: "GET" }
      )
        .then(resp => resp.json())
        .then(data => {
          if (data.data) {
            resolve(data.data);
          } else {
            resolve("error");
          }
        });
    });
    return courier;
  },
  fetchshopOrderDetails: async (dispatch: Dispatch, number: string) => {
    const courier = await new Promise((resolve, reject) => {
      fetch(`${__OMNI_HOST__}/omni/order_detail_api_web/?number=${number}`, {
        method: "GET"
      })
        .then(resp => resp.json())
        .then(data => {
          if (data.data) {
            resolve(data.data);
          } else {
            resolve("error");
          }
        });
    });
    return courier;
  }
};
