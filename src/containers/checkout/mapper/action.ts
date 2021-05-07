import { Dispatch } from "redux";
import AccountService from "services/account";
import CheckoutService from "services/checkout";
import BasketService from "services/basket";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    sendOtp: async (data: FormData) => {
      const otp = await AccountService.sendOtpBalance(dispatch, data);
      return otp;
    },
    sendOtpRedeem: async (data: FormData) => {
      const otp = await AccountService.sendOtpRedeem(dispatch, data);
      return otp;
    },
    checkOtpBalance: async (data: FormData) => {
      const balance = await AccountService.checkOtpBalance(dispatch, data);
      return balance;
    },
    checkOtpRedeem: async (
      data: FormData,
      history: any,
      isLoggedIn: boolean
    ) => {
      const balance = await AccountService.checkOtpRedeem(dispatch, data);
      BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
      return balance;
    },
    applyGiftCard: async (
      data: FormData,
      history: any,
      isLoggedIn: boolean
    ) => {
      const gift: any = await CheckoutService.applyGiftCard(dispatch, data);
      if (gift.status) {
        BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
      }
      return gift;
    },
    removeGiftCard: async (
      data: FormData,
      history: any,
      isLoggedIn: boolean
    ) => {
      const gift: any = await CheckoutService.removeGiftCard(dispatch, data);
      if (gift.status) {
        BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
      }
      return gift;
    },
    removePromo: async (data: FormData, history: any, isLoggedIn: boolean) => {
      const promo: any = await CheckoutService.removePromo(dispatch, data);
      if (promo.status) {
        BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
      }
      return promo;
    },
    removeRedeem: async (history: any, isLoggedIn: boolean) => {
      const promo: any = await CheckoutService.removeRedeem(dispatch);
      BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
      return promo;
    },
    applyPromo: async (data: FormData, history: any, isLoggedIn: boolean) => {
      const promo: any = await CheckoutService.applyPromo(dispatch, data);
      if (promo.status) {
        BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
      }
      return promo;
    }
  };
};

export default mapDispatchToProps;
