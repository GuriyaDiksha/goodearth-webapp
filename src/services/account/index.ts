import API from "utils/api";
import { Dispatch } from "redux";
import { ProfileResponse } from "containers/myAccount/components/MyProfile/typings";
import { MyOrdersResponse } from "containers/myAccount/components/MyOrder/typings";
import {
  BalanceProps,
  PrefernecesProps
} from "containers/myAccount/components/Balance/typings";
import { ConfirmResetPasswordResponse } from "containers/resetPassword/typings";
// import CookieService from "services/cookie";
// import { updateCookies } from "actions/cookies";
// import { resetMeta } from "actions/user";
// import MetaService from "services/meta";
// import WishlistService from "services/wishlist";
// import BasketService from "services/basket";
import { encryptdata, decriptdata } from "utils/validate";
import { updateUser } from "actions/user";

export default {
  fetchProfileData: async (dispatch: Dispatch) => {
    const data = await API.get<ProfileResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/customer/profile"}`
    );
    const response = decriptdata(data);
    return response;
  },
  updateProfileData: async (dispatch: Dispatch, formData: FormData) => {
    const newdata = { ...formData };
    const enc = encryptdata(newdata);
    const data = await API.post<ProfileResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/customer/update_profile/"}`,
      enc
    );
    const response = decriptdata(data);
    dispatch(updateUser(data));
    return response;
  },
  changePassword: async (dispatch: Dispatch, formData: FormData) => {
    const data = await API.post<any>(
      dispatch,
      `${__API_HOST__ + "/myapi/auth/change_password/"}`,
      formData
    );
    return data;
  },
  fetchMyOrders: async (dispatch: Dispatch, url?: string | null) => {
    const data = await API.post<MyOrdersResponse>(
      dispatch,
      url ? url : `${__API_HOST__ + "/myapi/order/my_orders"}`,
      {}
    );
    return data;
  },
  fetchOrders: async (dispatch: Dispatch, url?: string | null) => {
    const data = await API.post<MyOrdersResponse>(
      dispatch,
      url ? url : `${__API_HOST__ + "/myapi/order/user_orders"}`,
      {}
    );
    return data;
  },
  fetchInShopOrders: async (dispatch: Dispatch, email: string) => {
    const data = await API.post<any>(
      dispatch,
      `${__OMNI_HOST__}/omni/customer_offline_orders_web/`,
      {
        email: email
      }
    );
    return data;
  },
  fetchOrderBy: async (dispatch: Dispatch, id: string, email: string) => {
    const data = await API.post<MyOrdersResponse>(
      dispatch,
      `${__API_HOST__}/myapi/order/my_orders`,
      {
        orderNumber: id,
        email: email
      }
    );
    return data;
  },
  fetchOrderById: async (dispatch: Dispatch, id: string, email: string) => {
    const data = await API.post<MyOrdersResponse>(
      dispatch,
      `${__API_HOST__}/myapi/order/my_order_detail`,
      {
        orderNumber: id,
        email: email
      }
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
    const newdata = { ...formData };
    const enc = encryptdata(newdata);
    const data = await API.post<BalanceProps>(
      dispatch,
      `${__API_HOST__ + "/myapi/giftcard/send_otp_for_anonymous_user/"}`,
      enc
    );
    const response = decriptdata(data);
    return response;
  },
  sendOtpRedeem: async (dispatch: Dispatch, formData: FormData) => {
    const data = await API.post<BalanceProps>(
      dispatch,
      `${__API_HOST__ + "/imast/redemption_request_otp/"}`,
      formData
    );
    return data;
  },
  resendOtpRedeem: async (dispatch: Dispatch, points: number | string) => {
    const data = await API.post<BalanceProps>(
      dispatch,
      `${__API_HOST__ + "/imast/redemption_request_resend_otp/"}`,
      { points }
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
    const olddata = { ...formData };
    const enc = encryptdata(olddata);
    const data = await API.post<BalanceProps>(
      dispatch,
      `${__API_HOST__ + "/myapi/giftcard/send_giftcard_otp/"}`,
      enc
    );
    const response = decriptdata(data);
    const temp = {
      ...response,
      ...formData
    };
    return temp;
  },
  checkOtpBalance: async (dispatch: Dispatch, formData: any) => {
    const olddata = { ...formData };
    const enc = encryptdata(olddata);
    const data = await API.post<BalanceProps>(
      dispatch,
      `${__API_HOST__ +
        "/myapi/giftcard/giftcard_balance_check_for_anonymous_user/"}`,
      enc
    );
    const response = decriptdata(data);
    const temp = {
      ...response
    };
    temp["code"] = formData.code;
    return temp;
  },
  checkOtpRedeem: async (dispatch: Dispatch, formData: any) => {
    const data = await API.post<BalanceProps>(
      dispatch,
      `${__API_HOST__ + "/imast/redemption_request_validate/"}`,
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
    // // do same as logout
    // document.cookie = "atkn=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    // document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    // document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    // dispatch(updateCookies({ tkn: "" }));
    // MetaService.updateMeta(dispatch, {}).catch(err => {
    //   console.log(err);
    // });
    // WishlistService.resetWishlist(dispatch);
    // BasketService.fetchBasket(dispatch).catch(err => {
    //   console.log(err);
    // });
    // dispatch(resetMeta(undefined));
    return data;
  },
  activateGiftCard: async (dispatch: Dispatch, formData: FormData) => {
    const olddata = { ...formData };
    const enc = encryptdata(olddata);
    const data = await API.post<BalanceProps>(
      dispatch,
      `${__API_HOST__ + "/myapi/giftcard/giftcard_activate/"}`,
      enc
    );

    const response = decriptdata(data);
    const temp = {
      ...response
      // ...formData
    };
    return temp;
  },
  fetchInshopOrder: async (dispatch: Dispatch, email: string) => {
    const data: any = await API.post<BalanceProps>(
      dispatch,
      `${__API_HOST__}/myapi/order/customer_offline_orders_web/`,
      {
        email: email
      }
    );
    if (data.data) {
      return data.data;
    } else {
      return "error";
    }
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
  },
  fetchAccountPreferences: async (dispatch: Dispatch) => {
    const data: any = await API.get<PrefernecesProps>(
      dispatch,
      `${__API_HOST__}/myapi/customer/profile_preferences/`
    );
    return data;
  },
  updateAccountPreferences: async (
    dispatch: Dispatch,
    postData: PrefernecesProps
  ) => {
    const data: any = await API.post<PrefernecesProps>(
      dispatch,
      `${__API_HOST__}/myapi/customer/profile_preferences/`,
      {
        subscribe: postData.subscribe,
        whatsappNo: postData.whatsappNo,
        whatsappNoCountryCode: postData.whatsappNoCountryCode,
        whatsappSubscribe: postData.whatsappSubscribe
      }
    );
    return data;
  },
  sendProfileEditRequest: async (dispatch: Dispatch, formData: FormData) => {
    const data = await API.post<ProfileResponse>(
      dispatch,
      `${__API_HOST__ + "/myapi/customer/edit_profile_request/"}`,
      formData
    );
    return data;
  }
};
