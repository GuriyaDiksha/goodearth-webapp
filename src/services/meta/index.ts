import Axios, { AxiosResponse } from "axios";
import { Dispatch } from "redux";
// typings
import { MetaResponse } from "./typings";
import { Cookies } from "typings/cookies";
// actions
import { updateUser } from "actions/user";
import { updateCurrency } from "actions/currency";

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
    const meta: MetaResponse = await this.fetchMeta(cookies);
    const user = meta.user;
    user.bridal = meta.bridalUser;
    dispatch(updateUser(user));
    dispatch(updateCurrency(meta.currency));
  }
};
