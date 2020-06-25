import { Dispatch } from "redux";
import AccountService from "services/account";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchMyOrders: (data: FormData) => {
      return AccountService.fetchMyOrders(dispatch);
    }
  };
};

export default mapDispatchToProps;
