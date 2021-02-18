import { InitAction } from "typings/actions";
import { Store } from "redux";
// import { updateAddressList } from "actions/address";
import AddressService from "services/address";
import { updatePinCodeList } from "actions/address";

const initActionAccount: InitAction = async (store: Store) => {
  // const [addressList] = await Promise.all([
  //   AddressService.fetchAddressList(dispatch)
  // ]);
  // dispatch(updateAddressList(addressList));
  const dispatch = store.dispatch;
  AddressService.fetchPinCodeData(dispatch)
    .then(data => {
      const pinCodeList = Object.keys(data);
      dispatch(updatePinCodeList(data, pinCodeList));
    })
    .catch(err => {
      console.log("PINCODE API ERROR ====" + err);
    });
};

export default initActionAccount;
