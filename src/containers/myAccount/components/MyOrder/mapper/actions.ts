import { Dispatch } from "redux";
import AccountService from "services/account";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchMyOrders: (data: FormData) => {
      return AccountService.fetchMyOrders(dispatch);
    },
    fetchOrderBy: (order: string, email: string) => {
      return AccountService.fetchOrderBy(dispatch, order, email);
    },
    fetchCourierData: (order: string) => {
      return AccountService.fetchCourierData(dispatch, order);
    }
  };
};

export default mapDispatchToProps;
