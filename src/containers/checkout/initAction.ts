import { updatePinCodeList } from "actions/address";
import { InitAction } from "typings/actions";
// import Api from "services/api";
import AddressService from "../../services/address";

const initActionCheckout: InitAction = async dispatch => {
  // code
  // Api.getCurrency(dispatch);
  AddressService.fetchPinCodeData(dispatch)
    .then(data => {
      const pinCodeList = Object.keys(data);
      dispatch(updatePinCodeList(data, pinCodeList));
    })
    .catch(err => {
      console.log("PINCODE API ERROR ====" + err);
    });
};

export default initActionCheckout;
