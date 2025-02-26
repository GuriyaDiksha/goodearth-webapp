import { Dispatch } from "redux";
// typings
import { MetaResponse, PageMetaRequest, PageMetaResponse } from "./typings";
import { Cookies } from "typings/cookies";
// actions
import { updateUser } from "actions/user";
import { updateCurrency } from "actions/currency";
import { resetPageMeta, updatePageMeta } from "actions/meta";
import { User } from "typings/user";
import { initialState } from "reducers/user";
import API from "utils/api";
import { updateComponent, updateModal } from "actions/modal";
import HeaderService from "services/headerFooter";
import CookieService from "services/cookie";
import { POPUP } from "constants/components";
import { decriptdata } from "utils/validate";
import { updateRegion } from "actions/widget";

export default {
  fetchMeta: async function(
    dispatch: Dispatch,
    cookies: Cookies,
    bridalKey?: string
  ): Promise<MetaResponse> {
    // const payload = !bridalKey ? {} : { bridalKey };
    const res: any = await API.post(
      dispatch,
      `${__API_HOST__ + `/myapi/auth/meta/`}`,
      {}
      // {
      //     Authorization: `Token ${cookies.tkn || ""}`
      // }
    );
    const innerUser = decriptdata({ ...res.user });
    delete res.user;
    const shipping = res.shippingData
      ? decriptdata({ ...res.shippingData })
      : null;
    delete res.shippingData;
    const response = { ...decriptdata({ ...res }) };
    response.user = { ...innerUser };
    response.shippingData = shipping;
    return response;
  },

  updateMeta: async function(
    dispatch: Dispatch,
    cookies: Cookies,
    bridalKey?: string
  ) {
    let user: Partial<User> = initialState;
    if (cookies.tkn) {
      const meta: MetaResponse = await this.fetchMeta(
        dispatch,
        cookies,
        bridalKey
      );
      user = meta.user || {};
      user.bridal = meta.bridalUser;
      user.bridalId = meta.bridalId;
      user.bridalCurrency = meta.bridalCurrency;
      user.isLoggedIn = true;
      user.shippingData = meta.shippingData;
      user.customerGroup = meta.customerGroup;
      user.phoneNumber = meta.user.phoneNumber;
      user.id = meta.user.id;

      let upp;
      if (typeof document != "undefined" && typeof window != "undefined") {
        upp = user.phoneNumber
          ? user.phoneNumber
          : CookieService.getCookie(`upp_${user.id}`);
        console.log("upp cookie value ==", upp);
      } else {
        upp = user.phoneNumber ? user.phoneNumber : "";
        console.log("upp phoneNo. value ==", upp);
      }
      if (
        typeof document != "undefined" &&
        user.email &&
        (!user.gender ||
          !user.country ||
          !user.lastName ||
          !user.firstName ||
          (!user.phoneNumber && !upp))
      ) {
        dispatch(updateComponent(POPUP.PROFILEUPDATER, null, true));
        dispatch(updateModal(true));
      }
      dispatch(updateUser(user));
      if (user.email) {
        const res: { slab: string } = await HeaderService.getCustomerSlab(
          dispatch,
          user.email
        );
        dispatch(updateUser({ slab: res.slab }));
      }
      if (typeof document != "undefined") {
        CookieService.setCookie("currency", meta.currency, 365);
        CookieService.setCookie("user", JSON.stringify(meta.user), 365);
      }
      dispatch(updateCurrency(meta.currency));
      if (meta?.shippingData?.countryName) {
        dispatch(updateRegion({ country: meta?.shippingData?.countryName }));
      }
      return meta;
    }
  },

  fetchPageMeta: async (dispatch: Dispatch, request: PageMetaRequest) => {
    const res: PageMetaResponse = await API.post(
      dispatch,
      `${__API_HOST__ + `/myapi/pagemeta/meta-list/`}`,
      request
    );
    return res;
  },
  updatePageMeta: async function(
    dispatch: Dispatch,
    request?: PageMetaRequest
  ) {
    try {
      if (request) {
        const meta: PageMetaResponse = await this.fetchPageMeta(
          dispatch,
          request
        );

        dispatch(updatePageMeta(meta));
      } else {
        dispatch(resetPageMeta());
      }
    } catch (err) {
      console.log("Meta List API error!");
    }
  }
};
