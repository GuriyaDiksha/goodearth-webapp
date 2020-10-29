import React from "react";
import { Dispatch } from "redux";
import LoginService from "services/login";
import loadable from "@loadable/component";
import WishlistService from "services/wishlist";
import BasketService from "services/basket";
import MetaService from "services/meta";
import { Cookies } from "typings/cookies";
import { showMessage } from "actions/growlMessage";
import { CURRENCY_CHANGED_SUCCESS } from "constants/messages";
import { updateComponent, updateModal } from "actions/modal";
import { Currency } from "typings/currency";
const FreeShipping = loadable(() => import("components/Popups/freeShipping"));
import PincodePopup from "components/Popups/pincodePopup";
import HeaderService from "services/headerFooter";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    goLogin: (event: React.MouseEvent) => {
      LoginService.showLogin(dispatch);
      event.preventDefault();
    },
    handleLogOut: (history: any) => {
      LoginService.logout(dispatch);
      history.push("/");
    },
    onLoadAPiCall: (basketcall: boolean, cookies: Cookies) => {
      MetaService.updateMeta(dispatch, cookies);
      basketcall && WishlistService.updateWishlist(dispatch);
      BasketService.fetchBasket(dispatch);
    },
    changeCurrency: async (data: { currency: Currency }) => {
      const response = await LoginService.changeCurrency(dispatch, data);
      return response;
    },
    reloadPage: (cookies: Cookies) => {
      HeaderService.fetchHeaderDetails(dispatch);
      HeaderService.fetchFooterDetails(dispatch);
      MetaService.updateMeta(dispatch, cookies);
      BasketService.fetchBasket(dispatch);
      dispatch(showMessage(CURRENCY_CHANGED_SUCCESS, 7000));
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
    }
  };
};

export default mapDispatchToProps;
