import React from "react";
import { Dispatch } from "redux";
import LoginService from "services/login";
import WishlistService from "services/wishlist";
import BasketService from "services/basket";
import MetaService from "services/meta";
import { Cookies } from "typings/cookies";
import { MESSAGE } from "constants/messages";
import { updateComponent, updateModal } from "actions/modal";
import { updateMobileMenuOpenState, updateSizeChartShow } from "actions/header";
import { Currency } from "typings/currency";
import Api from "services/api";
import HeaderService from "services/headerFooter";
import { POPUP } from "constants/components";
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
    handleLogOut: (history: any, currency: Currency, customerGroup: string) => {
      LoginService.logout(dispatch, currency, customerGroup);
      history.push("/");
    },
    onLoadAPiCall: (
      basketcall: boolean,
      cookies: Cookies,
      bridalKey?: string,
      sortBy = "added_on",
      page?: string
    ) => {
      MetaService.updateMeta(dispatch, cookies, bridalKey);
      if (!page?.includes("/wishlist")) {
        WishlistService.updateWishlist(dispatch, sortBy);
      }

      BasketService.fetchBasket(dispatch);
    },
    changeCurrency: async (data: { currency: Currency }) => {
      const response = await LoginService.changeCurrency(dispatch, data);
      return response;
    },
    reloadPage: (
      cookies: Cookies,
      currency: Currency,
      customerGroup: string,
      page?: string,
      islogin?: boolean,
      sortBy = "added_on"
    ) => {
      // if (page == "/") {
      // }
      // if (page == "/") {
      HeaderService.fetchHeaderDetails(dispatch, currency, customerGroup).catch(
        err => {
          console.log("HEADER API ERROR ==== " + err);
        }
      );
      HeaderService.fetchFooterDetails(dispatch).catch(err => {
        console.log("FOOTER API ERROR ==== " + err);
      });
      Api.getAnnouncement(dispatch).catch(err => {
        console.log("Announcement API ERROR ==== " + err);
      });
      Api.getSalesStatus(dispatch).catch(err => {
        console.log("Sale status API error === " + err);
      });
      Api.getPopups(dispatch).catch(err => {
        console.log("Popups Api ERROR === " + err);
      });
      // }
      if (!page?.includes("/wishlist")) {
        WishlistService.updateWishlist(
          dispatch,
          sortBy == "discount" ? "added_on" : sortBy
        );
      }
      // HeaderService.fetchHomepageData(dispatch).catch(err => {
      //   console.log("Homepage API ERROR ==== " + err);
      // });

      MetaService.updateMeta(dispatch, cookies);
      BasketService.fetchBasket(dispatch);
      util.showGrowlMessage(dispatch, MESSAGE.CURRENCY_CHANGED_SUCCESS, 7000);
    },
    showShipping: (remainingAmount: number, freeShippingApplicable: number) => {
      dispatch(
        updateComponent(
          POPUP.FREESHIPPING,
          { remainingAmount, freeShippingApplicable },
          true
        )
      );
      dispatch(updateModal(true));
    },
    showPincodePopup: (setPincode: (pinCode: string) => void) => {
      dispatch(updateComponent(POPUP.PINCODEPOPUP, { setPincode }, true));
      dispatch(updateModal(true));
    },
    showCerisePopup: () => {
      dispatch(updateComponent(POPUP.CERISE, undefined, true));
      dispatch(updateModal(true));
      sessionStorage.setItem("cerisedbl", "1");
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
      WishlistService.updateWishlist(dispatch);
      if (cookies.tkn) {
        MetaService.updateMeta(dispatch, cookies);
      }
      BasketService.fetchBasket(dispatch, source);
    },
    fetchAnnouncement: () => {
      Api.getAnnouncement(dispatch).catch(err => {
        console.log("ANNOUNCEMENT API ERROR ==== " + err);
      });
    },
    resendGcEmail: async (lineId: string) => {
      const res = await HeaderService.resendGcEmail(dispatch, lineId).then(
        res => {
          dispatch(updateComponent(POPUP.RESENDGC, { email: res.email }, true));
          dispatch(updateModal(true));
        }
      );
      return res;
    },
    updateMobileMenuOpenState: (state: boolean) => {
      dispatch(updateMobileMenuOpenState(state));
    },
    closeSizeChart: () => {
      dispatch(updateSizeChartShow(false));
    },
    closeModal: () => {
      dispatch(updateModal(false));
    }
  };
};

export default mapDispatchToProps;
