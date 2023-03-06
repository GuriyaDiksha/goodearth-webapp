import LoginService from "services/login";
import { Dispatch } from "redux";
import { showGrowlMessage } from "utils/validate";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";

export const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    goRegister: (event: React.MouseEvent, email: string) => {
      localStorage.setItem("tempEmail", email);
      dispatch(updateComponent(POPUP.LOGINFORM, { isRegister: true }, true));
      dispatch(updateModal(true));
      event.preventDefault();
    },
    resetPassword: (formData: FormData) => {
      return LoginService.resetPassword(dispatch, formData);
    },
    showGrowlMessage: (msg: string) => {
      showGrowlMessage(dispatch, msg);
    }
  };
};
