import { Dispatch } from "redux";
import AccountService from "services/account";
import { showGrowlMessage } from "utils/validate";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    changePassword: (data: FormData) => {
      return AccountService.changePassword(dispatch, data);
    },
    balanceCheck: async (data: FormData) => {
      const account = await AccountService.balanceCheck(dispatch, data);
      return account;
    },
    activateGiftCard: async (data: FormData) => {
      const activate = await AccountService.activateGiftCard(dispatch, data);
      return activate;
    },
    sendOtpGiftCard: async (data: FormData) => {
      const otp = await AccountService.sendOtpGiftcard(dispatch, data);
      return otp;
    },
    sendOtp: async (data: FormData) => {
      const otp = await AccountService.sendOtpBalance(dispatch, data);
      return otp;
    },
    checkOtpBalance: async (data: FormData) => {
      const balance = await AccountService.checkOtpBalance(dispatch, data);
      return balance;
    },
    checkGiftCard: async (code: string) => {
      const res = await AccountService.checkGiftCard(dispatch, code);
      return res;
    },
    showGCSuccess: (msg: string, timeout: number) => {
      showGrowlMessage(dispatch, msg, timeout);
    }
  };
};

export default mapDispatchToProps;
