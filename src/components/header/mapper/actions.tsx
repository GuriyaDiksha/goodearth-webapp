import React from "react";
import { Dispatch } from "redux";
import LoginService from "services/login";
import WishlistService from "services/wishlist";
import BasketService from "services/basket";
import MetaService from "services/meta";
import { Cookies } from "typings/cookies";
import { MESSAGE } from "constants/messages";
import { updateComponent, updateModal } from "actions/modal";
import {
  updateMobileMenuOpenState,
  updateShowSearchPopup,
  updateSizeChartShow,
  updateStoreState
} from "actions/header";
import { Currency } from "typings/currency";
import Api from "services/api";
import HeaderService from "services/headerFooter";
import { POPUP } from "constants/components";
import BridalService from "services/bridal";
import { updateNextUrl } from "actions/info";
import { showGrowlMessage } from "../../../utils/validate";
import { updateAddressMode } from "actions/address";
import { updateshowFiller } from "actions/filler";
import { updateRegion } from "actions/widget";
import { currentyToCountryMapping } from "constants/currency";
import CookieService from "services/cookie";

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
      // window.location.reload();
    },
    onLoadAPiCall: async (
      cookies: Cookies,
      bridalId: number,
      bridalKey?: string,
      sortBy = "added_on",
      page?: string
    ) => {
      await WishlistService.updateWishlist(dispatch, sortBy);
      if (bridalId > 0) {
        await BridalService.countBridal(dispatch, bridalId);
      }
      await MetaService.updateMeta(dispatch, cookies, bridalKey);
      // if (page?.includes("shared-wishlist")) {
      //   WishlistService.countWishlist(dispatch);
      // }
      // if (!page?.includes("shared-wishlist")) {

      // }
      if (!page?.includes("/cart") && !page?.includes("/order/checkout")) {
        await BasketService.fetchBasket(dispatch);
      }
      return;
    },
    changeCurrency: async (data: { currency: Currency }) => {
      const response = await LoginService.changeCurrency(dispatch, data);
      CookieService.setCookie(
        "country",
        currentyToCountryMapping[data?.currency],
        365
      );
      dispatch(
        updateRegion({ country: currentyToCountryMapping[data?.currency] })
      );
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
      // if (!page?.includes("/wishlist")) {
      WishlistService.updateWishlist(dispatch, sortBy);
      // }
      // WishlistService.countWishlist(dispatch);
      // HeaderService.fetchHomepageData(dispatch).catch(err => {
      //   console.log("Homepage API ERROR ==== " + err);
      // });

      MetaService.updateMeta(dispatch, cookies);
      BasketService.fetchBasket(dispatch);

      showGrowlMessage(dispatch, MESSAGE.CURRENCY_CHANGED_SUCCESS, 7000);
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
      dispatch(updateAddressMode("list"));
      return res;
    },
    reloadAfterBridal: (cookies: Cookies, source: string) => {
      Api.getAnnouncement(dispatch).catch(err => {
        console.log("FOOTER API ERROR ==== " + err);
      });
      WishlistService.updateWishlist(dispatch);
      // WishlistService.countWishlist(dispatch);
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
    },
    closeInShopAvailability: () => {
      dispatch(updateStoreState(false));
    },
    closeFillerPurchase: () => {
      dispatch(updateshowFiller(false));
    },
    updateShowSearchPopup: (state: boolean) => {
      dispatch(updateShowSearchPopup(state));
    },
    fetchBasketMinibag: async () => {
      return await BasketService.fetchBasket(dispatch);
    },
    fetchBasketCartpage: async () => {
      return await BasketService.fetchBasket(dispatch, "cart");
    },
    updateProfile: () => {
      dispatch(updateComponent(POPUP.PROFILEUPDATER, null, true));
      dispatch(updateModal(true));
    }
  };
};

export default mapDispatchToProps;
