import { updateNextUrl } from "actions/info";
import { Dispatch } from "redux";
import LoginService from "services/login";
import { Currency } from "typings/currency";
import { showGrowlMessage } from "utils/validate";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    goForgotPassword: (
      event: React.MouseEvent,
      email: string,
      boEmail?: string
    ) => {
      localStorage.setItem("tempEmail", email);
      localStorage.setItem("isBo", boEmail || "");
      LoginService.showForgotPassword(dispatch, email);
      event.preventDefault();
    },
    goRegister: (event: React.MouseEvent, email: string) => {
      localStorage.setItem("tempEmail", email);
      LoginService.showRegister(dispatch);
      event?.preventDefault();
    },
    resetPassword: (formData: FormData) => {
      return LoginService.resetPassword(dispatch, formData);
    },
    checkUserPassword: (email: string) => {
      return LoginService.checkUserPassword(dispatch, email);
    },
    login: (
      email: string,
      password: string,
      currency: Currency,
      source?: string,
      history?: any
      // sortBy?: string
    ) => {
      return LoginService.login(
        dispatch,
        email,
        password,
        currency,
        source,
        history
        // sortBy
      );
    },
    resetNextUrl: () => {
      dispatch(updateNextUrl(""));
    },
    showGrowlMessage: (msg: string) => {
      showGrowlMessage(dispatch, msg);
    }
  };
};

export default mapDispatchToProps;
