import Axios, { AxiosResponse } from "axios";
import { Dispatch } from "redux";
// typings
import { MetaResponse, PageMetaRequest, PageMetaResponse } from "./typings";
import { Cookies } from "typings/cookies";
// actions
import { updateUser } from "actions/user";
import { updateCurrency } from "actions/currency";
import { resetPageMeta, updatePageMeta } from "actions/meta";

export default {
  fetchMeta: async function(cookies: Cookies): Promise<MetaResponse> {
    const res: AxiosResponse<MetaResponse> = await Axios.post(
      `http://api.goodearth.in/myapi/auth/meta/`,
      {},
      {
        headers: {
          Authorization: `Token ${cookies.tkn || ""}`
        }
      }
    );
    return res.data;
  },

  updateMeta: async function(dispatch: Dispatch, cookies: Cookies) {
    let user = {
      firstName: "",
      lastName: "",
      email: "",
      id: "",
      loyalityEligible: false,
      bridal: false,
      isLoggedIn: false
    };
    if (cookies.tkn) {
      const meta: MetaResponse = await this.fetchMeta(cookies);
      user = meta.user;
      user.bridal = meta.bridalUser;
      user.isLoggedIn = true;
      dispatch(updateCurrency(meta.currency));
    }
    dispatch(updateUser(user));
  },

  fetchPageMeta: async (request: PageMetaRequest) => {
    const res: AxiosResponse<PageMetaResponse> = await Axios.post(
      `http://api.goodearth.in/myapi/pagemeta/meta-list/`,
      request
    );
    return res.data;
  },
  updatePageMeta: async function(
    dispatch: Dispatch,
    request?: PageMetaRequest
  ) {
    if (request) {
      const meta: PageMetaResponse = await this.fetchPageMeta(request);

      dispatch(updatePageMeta(meta));
    } else {
      dispatch(resetPageMeta());
    }
  }
};
