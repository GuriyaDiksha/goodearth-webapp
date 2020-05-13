import { Dispatch } from "redux";
import LoginService from "services/login";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    resetPassword: async (formData: FormData) => {
      const res = await LoginService.resetPassword(dispatch, formData);
      return res;
    },
    checkUserPassword: (email: string) => {
      return LoginService.checkUserPassword(dispatch, email);
    },
    login: (email: string, password: string) => {
      return LoginService.login(dispatch, email, password);
    },
    register: (formData: FormData) => {
      return LoginService.register(dispatch, formData);
    },
    goLogin: (event: React.MouseEvent, email: string) => {
      localStorage.setItem("tempEmail", email);
      LoginService.showLogin(dispatch);
      event.preventDefault();
    },
    fetchCountryData: () => {
      return LoginService.fetchCountryData(dispatch);
    }
  };
};

export default mapDispatchToProps;
