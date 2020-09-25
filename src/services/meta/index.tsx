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
import ProfileUpdater from "components/signin/profileUpdater";
import React from "react";
import HeaderService from "services/headerFooter";

export default {
  fetchMeta: async function(
    dispatch: Dispatch,
    cookies: Cookies
  ): Promise<MetaResponse> {
    const res: MetaResponse = await API.post(
      dispatch,
      `${__API_HOST__ + `/myapi/auth/meta/`}`,
      {}
      // {
      //     Authorization: `Token ${cookies.tkn || ""}`
      // }
    );
    return res;
  },

  updateMeta: async function(dispatch: Dispatch, cookies: Cookies) {
    let user: Partial<User> = initialState;
    if (cookies.tkn) {
      const meta: MetaResponse = await this.fetchMeta(dispatch, cookies);
      user = meta.user || {};
      user.bridal = meta.bridalUser;
      user.isLoggedIn = true;
      user.shippingData = meta.shippingData;
      if (typeof document != "undefined" && user.email && !user.gender) {
        dispatch(updateComponent(<ProfileUpdater />, true));
        dispatch(updateModal(true));
      }
      if (user.email) {
        const res: { slab: string } = await HeaderService.getCustomerSlab(
          dispatch,
          user.email
        );
        dispatch(updateUser({ slab: res.slab }));
      }
      dispatch(updateCurrency(meta.currency));
      dispatch(updateUser(user));
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
    if (request) {
      const meta: PageMetaResponse = await this.fetchPageMeta(
        dispatch,
        request
      );

      dispatch(updatePageMeta(meta));
    } else {
      dispatch(resetPageMeta());
    }
  }
};
