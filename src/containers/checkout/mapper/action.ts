import { Dispatch } from "redux";
import AccountService from "services/account";
import CheckoutService from "services/checkout";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    changePassword: (data: FormData) => {
      return AccountService.changePassword(dispatch, data);
    },
    balanceCheck: async (data: FormData) => {
      const account = await AccountService.balanceCheck(dispatch, data);
      return account;
    },
    sendOtp: async (data: FormData) => {
      const otp = await AccountService.sendOtpBalance(dispatch, data);
      return otp;
    },
    checkOtpBalance: async (data: FormData) => {
      const balance = await AccountService.checkOtpBalance(dispatch, data);
      return balance;
    },
    applyGiftCard: async (data: FormData) => {
      const gift = await CheckoutService.applyGiftCard(dispatch, data);
      return gift;
    },
    applyPromo: async (data: FormData) => {
      const promo = await CheckoutService.applyGiftCard(dispatch, data);
      return promo;
    }
  };
};

export default mapDispatchToProps;
