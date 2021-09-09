import { Dispatch } from "redux";
import LoginService from "services/login";
import { updateCountryData } from "actions/address";
import { Currency } from "typings/currency";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    resetPassword: async (formData: FormData) => {
      const res = await LoginService.resetPassword(dispatch, formData);
      return res;
    },
    checkUserPassword: (email: string) => {
      return LoginService.checkUserPassword(dispatch, email);
    },
    login: (email: string, password: string, currency: Currency) => {
      return LoginService.login(dispatch, email, password, currency);
    },
    register: (formData: FormData, source?: string) => {
      return LoginService.register(dispatch, formData, source);
    },
    goLogin: (event: React.MouseEvent, email: string) => {
      localStorage.setItem("tempEmail", email);
      LoginService.showLogin(dispatch);
      event.preventDefault();
    },
    fetchCountryData: async () => {
      const countryData = await LoginService.fetchCountryData(dispatch);
      dispatch(updateCountryData(countryData));
    }
  };
};

export default mapDispatchToProps;
