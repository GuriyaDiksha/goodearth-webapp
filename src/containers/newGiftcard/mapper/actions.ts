import { Dispatch } from "redux";
import GiftcardService from "services/giftcard";
import LoginService from "services/login";
import HeaderService from "services/headerFooter";
import Api from "services/api";
import WishlistService from "services/wishlist";
import MetaService from "services/meta";
import BasketService from "services/basket";
import { updateBasket } from "actions/basket";
import { Basket } from "typings/basket";
import { showGrowlMessage } from "utils/validate";
import { Cookies } from "typings/cookies";
import { Currency } from "typings/currency";
import { MESSAGE } from "constants/messages";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    fetchCountryList: async () => {
      const data = await GiftcardService.fetchCountryList(dispatch);
      return data;
    },
    fetchProductList: async () => {
      const data = await GiftcardService.fetchProductList(dispatch);
      return data;
    },
    addToGiftcard: async (data: any) => {
      const result = await GiftcardService.addToGiftcard(dispatch, data);
      return result;
    },
    updateBasket: (basket: Basket) => {
      dispatch(updateBasket(basket));
    },
    showGrowlMessage: (string: string) => {
      showGrowlMessage(dispatch, string);
    },
    changeCurrency: async (data: any) => {
      const result = await LoginService.changeCurrency(dispatch, data);
      return result;
    },
    reloadPage: (
      cookies: Cookies,
      currency: Currency,
      customerGroup: string
    ) => {
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
      WishlistService.updateWishlist(dispatch);
      MetaService.updateMeta(dispatch, cookies);
      BasketService.fetchBasket(dispatch);
      showGrowlMessage(dispatch, MESSAGE.CURRENCY_CHANGED_SUCCESS, 7000);
    }
  };
};

export default mapActionsToProps;
