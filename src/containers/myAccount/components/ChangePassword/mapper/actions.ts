import { Dispatch } from "redux";
import AccountService from "services/account";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    changePassword: (data: FormData) => {
      return AccountService.changePassword(dispatch, data);
    }
  };
};

export default mapDispatchToProps;
