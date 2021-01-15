import React from "react";
import { Dispatch } from "redux";
import LoginService from "services/login";
import loadable from "@loadable/component";
import WishlistService from "services/wishlist";
import BasketService from "services/basket";
import MetaService from "services/meta";
import { Cookies } from "typings/cookies";
import { CURRENCY_CHANGED_SUCCESS } from "constants/messages";
import { updateComponent, updateModal } from "actions/modal";
import { Currency } from "typings/currency";
import Api from "services/api";
const FreeShipping = loadable(() => import("components/Popups/freeShipping"));
import PincodePopup from "components/Popups/pincodePopup";
import HeaderService from "services/headerFooter";
import BridalService from "services/bridal";
import { updateNextUrl } from "actions/info";
import * as util from "../../../utils/validate";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    goLogin: (event?: React.MouseEvent, nextUrl?: string) => {
      LoginService.showLogin(dispatch);
      nextUrl && dispatch(updateNextUrl(nextUrl));
      event?.preventDefault();
    },
    handleLogOut: (history: any) => {
      LoginService.logout(dispatch);
      history.push("/");
    },
    onLoadAPiCall: (
      basketcall: boolean,
      cookies: Cookies,
      bridalKey?: string
    ) => {
      MetaService.updateMeta(dispatch, cookies, bridalKey);
      basketcall && WishlistService.updateWishlist(dispatch);
      BasketService.fetchBasket(dispatch);
    },
    changeCurrency: async (data: { currency: Currency }) => {
      const response = await LoginService.changeCurrency(dispatch, data);
      return response;
    },
    reloadPage: (cookies: Cookies, page?: string, islogin?: boolean) => {
      // if (page == "/") {
      // }
      // if (page == "/") {
      HeaderService.fetchHeaderDetails(dispatch).catch(err => {
        console.log("FOOTER API ERROR ==== " + err);
      });
      HeaderService.fetchFooterDetails(dispatch).catch(err => {
        console.log("FOOTER API ERROR ==== " + err);
      });
      Api.getAnnouncement(dispatch).catch(err => {
        console.log("FOOTER API ERROR ==== " + err);
      });
      // }
      // if (page?.includes("/category_landing/")) {
      //   // L
      // }
      islogin ? WishlistService.updateWishlist(dispatch) : "";
      MetaService.updateMeta(dispatch, cookies);
      BasketService.fetchBasket(dispatch);
      util.showGrowlMessage(dispatch, CURRENCY_CHANGED_SUCCESS, 7000);
    },
    showShipping: (remainingAmount: number) => {
      dispatch(
        updateComponent(
          <FreeShipping remainingAmount={remainingAmount} />,
          true
        )
      );
      dispatch(updateModal(true));
    },
    showPincodePopup: (setPincode: (pinCode: string) => void) => {
      dispatch(updateComponent(<PincodePopup setPincode={setPincode} />, true));
      dispatch(updateModal(true));
    },
    getCustomerSlab: async (formData: any) => {
      const res = await HeaderService.getCustomerSlab(dispatch, formData);
      return res;
    },
    clearBridalSession: async () => {
      const res = await BridalService.clearBridalSession(dispatch);
      return res;
    },
    reloadAfterBridal: (cookies: Cookies, source: string) => {
      Api.getAnnouncement(dispatch).catch(err => {
        console.log("FOOTER API ERROR ==== " + err);
      });
      if (cookies.tkn) {
        WishlistService.updateWishlist(dispatch);
        MetaService.updateMeta(dispatch, cookies);
      }
      BasketService.fetchBasket(dispatch, source);
    },
    fetchAnnouncement: () => {
      Api.getAnnouncement(dispatch).catch(err => {
        console.log("ANNOUNCEMENT API ERROR ==== " + err);
      });
    }
  };
};

export default mapDispatchToProps;
