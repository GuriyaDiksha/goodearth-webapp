import { Dispatch } from "redux";
import LoginService from "services/login";
import AccountService from "services/account";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchCountryData: () => {
      return LoginService.fetchCountryData(dispatch);
    },
    fetchProfileData: () => {
      return AccountService.fetchProfileData(dispatch);
    },
    updateProfileData: (formData: FormData) => {
      return AccountService.updateProfileData(dispatch, formData);
    }
  };
};

export default mapDispatchToProps;
