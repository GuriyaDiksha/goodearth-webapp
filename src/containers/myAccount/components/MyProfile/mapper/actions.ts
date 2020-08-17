import { Dispatch } from "redux";
import LoginService from "services/login";
import AccountService from "services/account";
import { updateCountryData } from "actions/address";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchCountryData: async () => {
      const countryData = await LoginService.fetchCountryData(dispatch);
      dispatch(updateCountryData(countryData));
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
