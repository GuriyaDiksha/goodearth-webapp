import { InitAction } from "typings/actions";
import Api from "services/api";

const initActionCheckout: InitAction = async dispatch => {
  // code
  Api.getCurrency(dispatch);
};

export default initActionCheckout;
