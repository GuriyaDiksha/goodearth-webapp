import LoginService from "services/login";
import { Dispatch } from "redux";

export const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    goRegister: (event: React.MouseEvent) => {
      LoginService.showRegister(dispatch);
      event.preventDefault();
    },
    resetPassword: (formData: FormData) => {
      return LoginService.resetPassword(dispatch, formData);
    }
  };
};
