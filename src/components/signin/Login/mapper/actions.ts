import { Dispatch } from "redux";
import LoginService from "services/login";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    goForgotPassword: (event: React.MouseEvent) => {
      //     window.email_goodearth = this.refs.emailRef.state.value;
      LoginService.showForgotPassword(dispatch);
      event.preventDefault();
    },
    goRegister: (event: React.MouseEvent) => {
      // window.register_email = this.state.email;
      LoginService.showRegister(dispatch);
      event.preventDefault();
    },
    resetPassword: (formData: FormData) => {
      return LoginService.resetPassword(dispatch, formData);
    },
    checkUserPassword: (email: string) => {
      return LoginService.checkUserPassword(dispatch, email);
    },
    login: (email: string, password: string) => {
      return LoginService.login(dispatch, email, password);
    }
  };
};

export default mapDispatchToProps;
