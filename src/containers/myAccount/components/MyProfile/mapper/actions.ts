import { Dispatch } from "redux";
import LoginService from "services/login";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchCountryData: () => {
      return LoginService.fetchCountryData(dispatch);
    }
  };
};

export default mapDispatchToProps;
